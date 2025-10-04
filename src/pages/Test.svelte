<script>
  import { Button, Card, Alert, Stepper, StepIndicator } from 'flowbite-svelte';
  import { CheckCircleSolid, DatabaseSolid, ArrowRightAltSolid } from 'flowbite-svelte-icons';
  
  let activeStep = 0;
  
  const steps = [
    {
      label: "Prerequisites",
      description: "Setup requirements"
    },
    {
      label: "Initialize Alembic",
      description: "Init Alembic"
    },
    {
      label: "Configure Alembic",
      description: "Config setup"
    },
    {
      label: "Generate Migration",
      description: "Create migration"
    },
    {
      label: "Apply Migration",
      description: "Run migration"
    },
    {
      label: "Create Script",
      description: "Migration script"
    },
    {
      label: "Run Migration",
      description: "Execute"
    }
  ];

  const stepContent = [
    // Step 0: Prerequisites
    `<div class="space-y-4">
      <p class="text-gray-700 dark:text-gray-300">Before starting, you need to:</p>
      <div class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 border-l-4 border-blue-500">
        <p class="font-semibold mb-2">Create PostgreSQL Database</p>
        <p>Create a PostgreSQL database where you want to transfer your SQLite data.</p>
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Update database.py:</p>
        <pre class="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm"><code># database.py

DB_URL = "postgresql://username:password@localhost:5432/your_db"

engine = create_engine(DB_URL)</code></pre>
      </div>
    </div>`,
    
    // Step 1: Initialize Alembic
    `<div class="space-y-4">
      <p class="text-gray-700 dark:text-gray-300">Initialize Alembic in your project:</p>
      <pre class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm"><code>alembic init alembic</code></pre>
    </div>`,
    
    // Step 2: Configure Alembic
    `<div class="space-y-4">
      <div class="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 border-l-4 border-yellow-500">
        <p class="font-semibold mb-2">⚠️ Critical Configuration</p>
        <p>Make the following changes to configure Alembic properly.</p>
      </div>
      
      <div>
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">1. Update alembic/env.py (top of file):</p>
        <pre class="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm"><code>import sys
import os

# Add project paths
sys.path.append(os.path.dirname(os.getcwd()))
sys.path.append(os.getcwd()) 
sys.path.append(os.path.join(os.getcwd(), 'src'))

# Import models and Base
from src.models import r_model
from src.database.core import Base</code></pre>
      </div>

      <div>
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">2. Update target_metadata in alembic/env.py:</p>
        <pre class="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm"><code># Change from:
target_metadata = None

# To:
target_metadata = Base.metadata</code></pre>
      </div>

      <div>
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">3. Update alembic.ini:</p>
        <pre class="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm"><code># Change from:
sqlalchemy.url = driver://user:pass@localhost/dbname

# To:
sqlalchemy.url = postgresql://user:password@localhost:5432/your_db</code></pre>
      </div>
    </div>`,
    
    // Step 3: Generate Migration
    `<div class="space-y-4">
      <p class="text-gray-700 dark:text-gray-300">Generate the initial migration script:</p>
      <pre class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm"><code>alembic revision --autogenerate -m "initial pgsql schema setup"</code></pre>
    </div>`,
    
    // Step 4: Apply Migration
    `<div class="space-y-4">
      <p class="text-gray-700 dark:text-gray-300">Apply the migration to create tables in PostgreSQL:</p>
      <pre class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm"><code>alembic upgrade head</code></pre>
    </div>`,
    
    // Step 5: Create Migration Script
    `<div class="space-y-4">
      <p class="text-gray-700 dark:text-gray-300">Create a <code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">migrate.py</code> file in your project root:</p>
      <pre class="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm max-h-96"><code># migrate.py

import pandas as pd
from sqlalchemy import create_engine
import os

# Database URLs
SQLITE_URL = "sqlite:///./{your_sqlite_dbname}.db" 
POSTGRES_URL = "postgresql://username:password@localhost:5432/your_db"

# List tables to migrate
TABLES_TO_MIGRATE = ['users', 'restaurants', 'cuisines', 'orders', 'feedbacks']

def migrate_data():
    print("Starting data migration from SQLite to PostgreSQL...")

    # Connect to databases
    sqlite_engine = create_engine(SQLITE_URL)
    postgres_engine = create_engine(POSTGRES_URL)

    for table_name in TABLES_TO_MIGRATE:
        print(f"--- Migrating table: {table_name} ---")
        try:
            # Read data from SQLite
            df = pd.read_sql_table(table_name, sqlite_engine)

            # Write to PostgreSQL
            df.to_sql(
                table_name, 
                postgres_engine, 
                if_exists='append', 
                index=False
            )
            print(f"✅ Successfully transferred {len(df)} rows to {table_name}.")

        except Exception as e:
            print(f"❌ Failed to migrate {table_name}: {e}")

    print("\\nMigration complete. Check your PostgreSQL database.")

if __name__ == "__main__":
    migrate_data()</code></pre>
      <div class="p-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400">
        <p><span class="font-semibold">Note:</span> Update the database URLs and table names according to your project.</p>
      </div>
    </div>`,
    
    // Step 6: Run Migration
    `<div class="space-y-4">
      <p class="text-gray-700 dark:text-gray-300">Execute the migration script:</p>
      <pre class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm"><code>python migrate.py</code></pre>
      <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 border-l-4 border-green-500">
        <p class="font-semibold mb-2">🎉 Success!</p>
        <p>Your SQLite database data has been successfully migrated to PostgreSQL.</p>
      </div>
    </div>`
  ];

  function nextStep() {
    if (activeStep < steps.length - 1) {
      activeStep++;
    }
  }

  function prevStep() {
    if (activeStep > 0) {
      activeStep--;
    }
  }

  function goToStep(index) {
    activeStep = index;
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
  <div class="max-w-5xl mx-auto">
    
    <!-- Header -->
    <div class="text-center mb-8 md:mb-12">
      <div class="flex items-center justify-center gap-4 mb-4">
        <DatabaseSolid class="w-10 h-10 md:w-12 md:h-12 text-blue-600" />
        <ArrowRightAltSolid class="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
        <DatabaseSolid class="w-10 h-10 md:w-12 md:h-12 text-indigo-600" />
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
        SQLite to PostgreSQL Migration
      </h1>
      <p class="text-gray-600 dark:text-gray-400">Complete guide to migrate your database in 7 steps</p>
    </div>

    <!-- Custom Progress Stepper -->
    <Card class="mb-8">
      <div class="w-full overflow-x-auto">
        <ol class="flex items-center w-full justify-between">
          {#each steps as step, i}
            <li class="flex items-center {i < steps.length - 1 ? 'flex-1' : ''}">
              <button 
                onclick={() => goToStep(i)}
                class="flex flex-col items-center cursor-pointer">
                <span class="flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 transition-all
                  {activeStep === i ? 'bg-blue-600 text-white scale-110' : 
                   activeStep > i ? 'bg-green-500 text-white' : 
                   'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}">
                  {#if activeStep > i}
                    <CheckCircleSolid class="w-5 h-5" />
                  {:else}
                    <span class="font-semibold text-sm">{i + 1}</span>
                  {/if}
                </span>
                <span class="text-xs mt-2 text-gray-600 dark:text-gray-400 hidden xl:block text-center whitespace-nowrap">
                  {step.description}
                </span>
              </button>
              {#if i < steps.length - 1}
                <div class="flex-1 h-1 mx-1 lg:mx-2 rounded {activeStep > i ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}"></div>
              {/if}
            </li>
          {/each}
        </ol>
      </div>
    </Card>

    <!-- Step Content -->
    <Card size="xl" class="mb-8">
      <div class="mb-6">
        <h2 class="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Step {activeStep + 1}: {steps[activeStep].label}
        </h2>
      </div>
      
      <div class="prose dark:prose-invert max-w-none mb-8">
        {@html stepContent[activeStep]}
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button 
          color="alternative"
          onclick={prevStep}
          disabled={activeStep === 0}
        >
          Previous
        </Button>
        <Button 
          color={activeStep === steps.length - 1 ? 'alternative' : 'blue'}
          onclick={nextStep}
          disabled={activeStep === steps.length - 1}
        >
          {activeStep === steps.length - 1 ? 'Completed' : 'Next'}
        </Button>
      </div>
    </Card>

    <!-- Quick Summary -->
    <Card>
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Summary</h3>
      <ol class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        {#each steps as step, i}
          <li class="flex items-start gap-2">
            <span class="font-semibold text-blue-600 dark:text-blue-400 min-w-5">{i + 1}.</span>
            <span>{step.label}</span>
          </li>
        {/each}
      </ol>
    </Card>

  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>