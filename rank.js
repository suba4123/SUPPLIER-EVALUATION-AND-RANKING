const { exec } = require('child_process');

// Function to run the Python script and return a promise
function runPythonScript(category) {
    return new Promise((resolve, reject) => {
        // Execute the Python script and pass the category as an argument
        exec(`python C:\\Users\\suban\\OneDrive\\Desktop\\suppliar_module\\supplier_score.py "${category}"`, (error, stdout, stderr) => {
            if (error) {
                console.error('Error executing Python script:', error);
                return reject(new Error('Failed to execute Python script.'));
            }

            if (stderr) {
                console.error('Python script stderr:', stderr);
                return reject(new Error('Python script encountered an error.'));
            }

            // Parse the JSON output from the Python script
            let supplierRankings;
            try {
                supplierRankings = JSON.parse(stdout);
            } catch (parseError) {
                console.error('Error parsing supplier rankings:', parseError);
                return reject(new Error('Error parsing supplier rankings.'));
            }

            // Resolve the promise with the parsed supplier rankings
            resolve(supplierRankings);
        });
    });
}

// Export the function so it can be used in server.js
module.exports = { runPythonScript };
