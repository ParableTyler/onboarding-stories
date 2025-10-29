#!/usr/bin/env node

/**
 * Validate GraphQL Schema
 * 
 * This script:
 * 1. Parses the GraphQL schema files
 * 2. Validates syntax and type references
 * 3. Checks for common issues
 */

const { buildSchema, parse, validate } = require('graphql');
const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateSchemaFile(filePath) {
  try {
    log(`\n📄 Validating: ${filePath}`, 'blue');
    
    const schemaContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the schema
    const ast = parse(schemaContent);
    log('  ✓ Schema parsed successfully', 'green');
    
    // Count definitions
    const types = ast.definitions.filter(d => d.kind === 'ObjectTypeDefinition');
    const interfaces = ast.definitions.filter(d => d.kind === 'InterfaceTypeDefinition');
    const unions = ast.definitions.filter(d => d.kind === 'UnionTypeDefinition');
    const enums = ast.definitions.filter(d => d.kind === 'EnumTypeDefinition');
    const scalars = ast.definitions.filter(d => d.kind === 'ScalarTypeDefinition');
    
    log(`  ✓ Found ${types.length} types`, 'green');
    log(`  ✓ Found ${interfaces.length} interfaces`, 'green');
    log(`  ✓ Found ${unions.length} unions`, 'green');
    log(`  ✓ Found ${enums.length} enums`, 'green');
    log(`  ✓ Found ${scalars.length} custom scalars`, 'green');
    
    // Try to build schema (validates references)
    buildSchema(schemaContent);
    log('  ✓ All type references are valid', 'green');
    
    return true;
  } catch (error) {
    log(`  ✗ Error: ${error.message}`, 'red');
    if (error.locations) {
      error.locations.forEach(loc => {
        log(`    at line ${loc.line}, column ${loc.column}`, 'red');
      });
    }
    return false;
  }
}

function main() {
  log('\n🔍 GraphQL Schema Validation\n', 'blue');
  
  const schemaFiles = [
    'integration-schema.graphql',
    'examples/salesforce-plugin.graphql',
  ];
  
  let allValid = true;
  
  for (const file of schemaFiles) {
    const filePath = path.join(process.cwd(), file);
    
    if (!fs.existsSync(filePath)) {
      log(`⚠️  File not found: ${file}`, 'yellow');
      continue;
    }
    
    const isValid = validateSchemaFile(filePath);
    allValid = allValid && isValid;
  }
  
  log('\n' + '='.repeat(50) + '\n', 'blue');
  
  if (allValid) {
    log('✅ All schemas are valid!\n', 'green');
    process.exit(0);
  } else {
    log('❌ Schema validation failed\n', 'red');
    process.exit(1);
  }
}

main();

