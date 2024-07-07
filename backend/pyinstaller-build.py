import subprocess
import sys

def build():
    app = './run.py'
    options = [
        '--name=dockman_server',
        '--noconsole',  # No shell
        '--noconfirm',  # Don't confirm overwrite
        '--distpath=../resources',  # Dist (out) path
        app
    ]

    try:
        subprocess.run(['pyinstaller'] + options, check=True)
        print("Build completed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred during the build: {e}")
        sys.exit(1)

if __name__ == '__main__':
    build()
