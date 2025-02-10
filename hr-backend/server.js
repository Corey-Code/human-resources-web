import fastify from 'fastify';
import cors from '@fastify/cors';
import Database from 'better-sqlite3';

// Initialize Fastify app
const app = fastify({ logger: true });
app.register(cors);

// Connect to SQLite (creates `hrdb.sqlite` if not exists)
const db = new Database('hrdb.sqlite');

// Create `employee_events` table for event sourcing
db.exec(`
  CREATE TABLE IF NOT EXISTS employee_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('created', 'updated_name', 'updated_salary', 'updated_deductions')),
    event_data TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create `system_events` table for better system awareness
db.exec(`
    CREATE TABLE IF NOT EXISTS system_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL CHECK (event_type IN ('server_started', 'server_stopped')),
      event_data TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

/**
 * Rebuilds the current employee state from stored event logs.
 * @returns {Array} A list of employee objects with their latest state.
 */
function rebuildEmployeeState() {
  const events = db
    .prepare('SELECT * FROM employee_events ORDER BY timestamp ASC')
    .all();

  const employees = {};
  events.forEach(({ employee_id, event_type, event_data }) => {
    const data = JSON.parse(event_data);

    if (!employees[employee_id]) {
      employees[employee_id] = {
        id: employee_id,
        name: '',
        salary: 0,
        deductions: 0,
        netPay: 0,
      };
    }

    if (event_type === 'created') {
      employees[employee_id] = {
        ...data,
        netPay: data.salary - data.deductions,
      };
    } else if (event_type === 'updated_name') {
      employees[employee_id].name = data.name;
      employees[employee_id].netPay =
        employees[employee_id].salary - employees[employee_id].deductions;
    } else if (event_type === 'updated_salary') {
      employees[employee_id].salary = data.salary;
      employees[employee_id].netPay =
        employees[employee_id].salary - employees[employee_id].deductions;
    } else if (event_type === 'updated_deductions') {
      employees[employee_id].deductions = data.deductions;
      employees[employee_id].netPay =
        employees[employee_id].salary - employees[employee_id].deductions;
    }
  });

  return Object.values(employees);
}

/**
 * Retrieves all employees with their latest state.
 */
app.get('/api/employees', async (request, reply) => {
  return reply.send(rebuildEmployeeState());
});

/**
 * Validates employee data.
 * @param {Object} employeeData - Employee data containing name, salary, and deductions.
 * @returns {Object|null} Returns an error object if validation fails, otherwise null.
 */
function validateEmployeeData(employeeData) {
  const { name, salary, deductions } = employeeData;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return {
      error:
        'Invalid name: Must be a non-empty string with at least 2 characters.',
    };
  }
  if (salary == null || typeof salary !== 'number' || salary < 0) {
    return { error: 'Invalid salary: Must be a positive number.' };
  }
  if (deductions == null || typeof deductions !== 'number' || deductions < 0) {
    return { error: 'Invalid deductions: Must be a non-negative number.' };
  }
  return null;
}

/**
 * Adds a new employee by storing a 'created' event.
 */
app.post('/api/employees', async (request, reply) => {
  const validationError = validateEmployeeData(request.body);
  if (validationError) {
    return reply.status(400).send(validationError);
  }

  const { name, salary, deductions } = request.body;

  // Determine the next employee ID
  const lastEmployee = db
    .prepare('SELECT MAX(employee_id) AS max_id FROM employee_events')
    .get();
  const newEmployeeId = (lastEmployee?.max_id || 0) + 1;

  // Insert event
  db.prepare(
    'INSERT INTO employee_events (employee_id, event_type, event_data) VALUES (?, ?, ?)'
  ).run(
    newEmployeeId,
    'created',
    JSON.stringify({ id: newEmployeeId, name, salary, deductions })
  );

  return reply.status(201).send({
    message: 'Employee added successfully',
    employeeId: newEmployeeId,
  });
});

/**
 * Updates an employee's name using an event.
 */
app.put('/api/employees/:id/name', async (request, reply) => {
  const employeeId = parseInt(request.params.id);
  const { name } = request.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return reply
      .status(400)
      .send({ error: 'Invalid name: Must be at least 2 characters.' });
  }

  db.prepare(
    'INSERT INTO employee_events (employee_id, event_type, event_data) VALUES (?, ?, ?)'
  ).run(employeeId, 'updated_name', JSON.stringify({ name }));

  return reply.status(200).send({ message: 'Name updated successfully' });
});

/**
 * Updates an employee's salary using an event.
 */
app.put('/api/employees/:id/salary', async (request, reply) => {
  const employeeId = parseInt(request.params.id);
  const { salary } = request.body;

  if (salary == null || typeof salary !== 'number' || salary < 0) {
    return reply
      .status(400)
      .send({ error: 'Invalid salary: Must be a positive number.' });
  }

  db.prepare(
    'INSERT INTO employee_events (employee_id, event_type, event_data) VALUES (?, ?, ?)'
  ).run(employeeId, 'updated_salary', JSON.stringify({ salary }));

  return reply.status(200).send({ message: 'Salary updated successfully' });
});

/**
 * Updates an employee's deductions using an event.
 */
app.put('/api/employees/:id/deductions', async (request, reply) => {
  const employeeId = parseInt(request.params.id);
  const { deductions } = request.body;

  if (deductions == null || typeof deductions !== 'number' || deductions < 0) {
    return reply
      .status(400)
      .send({ error: 'Invalid deductions: Must be a non-negative number.' });
  }

  db.prepare(
    'INSERT INTO employee_events (employee_id, event_type, event_data) VALUES (?, ?, ?)'
  ).run(employeeId, 'updated_deductions', JSON.stringify({ deductions }));

  return reply.status(200).send({ message: 'Deductions updated successfully' });
});

/**
 * Starts the Fastify server and logs the event.
 */
const start = async () => {
  try {
    await app.listen({ port: 3000 });

    // Log the server start event in SQLite
    db.prepare(
      `
        INSERT INTO system_events (event_type, event_data)
        VALUES (?, ?)
      `
    ).run('server_started', JSON.stringify({ message: 'Server is online' }));

    console.log('✅ Server running on port 3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
