from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import tempfile
import os

app = Flask(__name__)
CORS(app)

@app.route('/run', methods=['POST'])
def run_code():
    data = request.json
    language = data['language']
    code = data['code']

    if language == 'py':
        # For Python, we can use subprocess directly
        try:
            result = subprocess.run(['python3', '-c', code], capture_output=True, text=True, timeout=5)
            return jsonify({'output': result.stdout + result.stderr})
        except subprocess.TimeoutExpired:
            return jsonify({'output': 'Execution timed out'})
    else:
        # For other languages, we need to create a file
        with tempfile.NamedTemporaryFile(suffix=f'.{language}', delete=False) as tmp:
            tmp.write(code.encode())
            tmp.flush()

        try:
            if language == 'cpp':
                compile_result = subprocess.run(['g++', tmp.name, '-o', tmp.name[:-4]], capture_output=True, text=True)
                if compile_result.returncode != 0:
                    return jsonify({'output': compile_result.stderr})
                result = subprocess.run([tmp.name[:-4]], capture_output=True, text=True, timeout=5)
            elif language == 'c':
                compile_result = subprocess.run(['gcc', tmp.name, '-o', tmp.name[:-2]], capture_output=True, text=True)
                if compile_result.returncode != 0:
                    return jsonify({'output': compile_result.stderr})
                result = subprocess.run([tmp.name[:-2]], capture_output=True, text=True, timeout=5)
            elif language == 'java':
                compile_result = subprocess.run(['javac', tmp.name], capture_output=True, text=True)
                if compile_result.returncode != 0:
                    return jsonify({'output': compile_result.stderr})
                result = subprocess.run(['java', '-cp', os.path.dirname(tmp.name), os.path.basename(tmp.name)[:-5]], capture_output=True, text=True, timeout=5)
            else:
                return jsonify({'output': 'Unsupported language'})

            return jsonify({'output': result.stdout + result.stderr})
        except subprocess.TimeoutExpired:
            return jsonify({'output': 'Execution timed out'})
        finally:
            os.unlink(tmp.name)
            if language in ['cpp', 'c']:
                os.unlink(tmp.name[:-4] if language == 'cpp' else tmp.name[:-2])

if __name__ == '__main__':
    app.run(debug=True)