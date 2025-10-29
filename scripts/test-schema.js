#!/usr/bin/env node

/**
 * Test GraphQL Schema Structure
 * 
 * This tests the actual structure and content of the schema
 */

const { buildSchema, parse } = require('graphql');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runTests() {
  log('\n🧪 Testing GraphQL Schema Structure\n', 'blue');
  
  let passed = 0;
  let failed = 0;
  
  const test = (description, fn) => {
    try {
      fn();
      log(`  ✓ ${description}`, 'green');
      passed++;
    } catch (error) {
      log(`  ✗ ${description}`, 'red');
      log(`    ${error.message}`, 'red');
      failed++;
    }
  };
  
  // Load schema
  const schemaPath = path.join(process.cwd(), 'integration-schema.graphql');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  const schema = buildSchema(schemaContent);
  const ast = parse(schemaContent);
  
  // Test 1: Check core types exist
  test('Plugin type exists', () => {
    const pluginType = schema.getType('Plugin');
    if (!pluginType) throw new Error('Plugin type not found');
  });
  
  test('PluginVariant type exists', () => {
    const variantType = schema.getType('PluginVariant');
    if (!variantType) throw new Error('PluginVariant type not found');
  });
  
  test('FormField union exists', () => {
    const formFieldType = schema.getType('FormField');
    if (!formFieldType) throw new Error('FormField union not found');
  });
  
  // Test 2: Check custom scalars
  const expectedScalars = ['Secret', 'Email', 'URL', 'Hostname', 'Date', 'File'];
  expectedScalars.forEach(scalarName => {
    test(`Custom scalar ${scalarName} exists`, () => {
      const scalar = schema.getType(scalarName);
      if (!scalar) throw new Error(`${scalarName} scalar not found`);
    });
  });
  
  // Test 3: Check field types
  const expectedFieldTypes = [
    'StringField',
    'SecretField',
    'EmailField',
    'URLField',
    'HostnameField',
    'SelectField',
    'MultiSelectField',
    'BooleanField',
    'ArrayField',
    'DateField',
    'FileField',
    'MarkdownField',
  ];
  
  expectedFieldTypes.forEach(fieldType => {
    test(`Field type ${fieldType} exists`, () => {
      const type = schema.getType(fieldType);
      if (!type) throw new Error(`${fieldType} type not found`);
    });
  });
  
  // Test 4: Check IFormField interface
  test('IFormField interface exists', () => {
    const interfaceType = schema.getType('IFormField');
    if (!interfaceType) throw new Error('IFormField interface not found');
  });
  
  test('IFormField has required fields', () => {
    const interfaceType = schema.getType('IFormField');
    const fields = interfaceType.getFields();
    const requiredFields = ['id', 'key', 'label', 'required', 'widget', 'mode'];
    
    requiredFields.forEach(fieldName => {
      if (!fields[fieldName]) {
        throw new Error(`IFormField missing required field: ${fieldName}`);
      }
    });
  });
  
  // Test 5: Check Query type
  test('Query type exists', () => {
    const queryType = schema.getQueryType();
    if (!queryType) throw new Error('Query type not found');
  });
  
  test('Query has plugins field', () => {
    const queryType = schema.getQueryType();
    const fields = queryType.getFields();
    if (!fields.plugins) throw new Error('plugins field not found in Query');
  });
  
  test('Query has pluginBySlug field', () => {
    const queryType = schema.getQueryType();
    const fields = queryType.getFields();
    if (!fields.pluginBySlug) throw new Error('pluginBySlug field not found in Query');
  });
  
  // Test 6: Check Mutation type
  test('Mutation type exists', () => {
    const mutationType = schema.getMutationType();
    if (!mutationType) throw new Error('Mutation type not found');
  });
  
  test('Mutation has testPluginConfig', () => {
    const mutationType = schema.getMutationType();
    const fields = mutationType.getFields();
    if (!fields.testPluginConfig) {
      throw new Error('testPluginConfig mutation not found');
    }
  });
  
  test('Mutation has createPluginConfig', () => {
    const mutationType = schema.getMutationType();
    const fields = mutationType.getFields();
    if (!fields.createPluginConfig) {
      throw new Error('createPluginConfig mutation not found');
    }
  });
  
  // Test 7: Check enums
  test('FieldWidgetType enum exists', () => {
    const enumType = schema.getType('FieldWidgetType');
    if (!enumType) throw new Error('FieldWidgetType enum not found');
  });
  
  test('AuthMethod enum exists', () => {
    const enumType = schema.getType('AuthMethod');
    if (!enumType) throw new Error('AuthMethod enum not found');
  });
  
  test('TestMethod enum exists', () => {
    const enumType = schema.getType('TestMethod');
    if (!enumType) throw new Error('TestMethod enum not found');
  });
  
  // Results
  log('\n' + '='.repeat(50) + '\n', 'blue');
  log(`Tests passed: ${passed}`, 'green');
  if (failed > 0) {
    log(`Tests failed: ${failed}`, 'red');
  }
  log('');
  
  return failed === 0;
}

const success = runTests();
process.exit(success ? 0 : 1);

