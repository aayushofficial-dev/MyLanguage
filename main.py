import subprocess
import sys
from pathlib import Path


def run_file(path):
    runner = Path(__file__).with_name('bin').joinpath('aayush.js')
    result = subprocess.run(['node', str(runner), 'run', path], check=False)
    if result.returncode:
        sys.exit(result.returncode)


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print('Usage: python main.py path/to/file.aayush')
        sys.exit(1)
    run_file(sys.argv[1])
