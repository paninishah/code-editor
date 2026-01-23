import subprocess
import tempfile
import textwrap
import os
from pathlib import Path


def _run_subprocess(cmd, input_text=None, timeout=5):
    try:
        proc = subprocess.run(
            cmd,
            input=input_text.encode("utf-8") if input_text is not None else None,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=timeout,
        )
        stdout = proc.stdout.decode("utf-8", errors="replace")
        stderr = proc.stderr.decode("utf-8", errors="replace")
        return stdout, stderr
    except subprocess.TimeoutExpired:
        return "", "Execution timed out"
    except Exception as e:
        return "", str(e)


def _run_python(code: str) -> dict:
    stdout, stderr = _run_subprocess(["python", "-"], input_text=code)
    return {"output": stdout or None, "error": stderr or None}


def _run_javascript(code: str) -> dict:
    # Requires Node.js (`node`) installed locally
    stdout, stderr = _run_subprocess(["node", "-"], input_text=code)
    return {"output": stdout or None, "error": stderr or None}


def _run_c_cpp(code: str, is_cpp: bool) -> dict:
    compiler = "g++" if is_cpp else "gcc"
    extension = ".cpp" if is_cpp else ".c"

    with tempfile.TemporaryDirectory() as tmpdir:
        src_path = Path(tmpdir) / f"main{extension}"
        bin_path = Path(tmpdir) / "a.out"

        src_path.write_text(code, encoding="utf-8")

        # Compile
        stdout, stderr = _run_subprocess(
            [compiler, str(src_path), "-O2", "-std=c++17"] if is_cpp else [compiler, str(src_path), "-O2"],
            timeout=8,
        )
        if stderr:
            return {"output": None, "error": stderr}

        # Run binary
        stdout, stderr = _run_subprocess([str(bin_path)], timeout=4)
        return {"output": stdout or None, "error": stderr or None}


def _run_java(code: str) -> dict:
    with tempfile.TemporaryDirectory() as tmpdir:
        src_path = Path(tmpdir) / "Main.java"
        src_path.write_text(code, encoding="utf-8")

        # Compile
        stdout, stderr = _run_subprocess(["javac", str(src_path)], timeout=8)
        if stderr:
            return {"output": None, "error": stderr}

        # Run
        env = os.environ.copy()
        env["CLASSPATH"] = str(tmpdir)
        try:
            proc = subprocess.run(
                ["java", "Main"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=4,
                env=env,
            )
            stdout = proc.stdout.decode("utf-8", errors="replace")
            stderr = proc.stderr.decode("utf-8", errors="replace")
            return {"output": stdout or None, "error": stderr or None}
        except subprocess.TimeoutExpired:
            return {"output": None, "error": "Execution timed out"}
        except Exception as e:
            return {"output": None, "error": str(e)}


def run(code: str, language: str) -> dict:
    """
    Run code locally for the selected language.
    No external network or Judge0 required.
    """
    language = (language or "").lower()

    if language == "python":
        return _run_python(code)
    if language == "javascript":
        return _run_javascript(code)
    if language == "c":
        return _run_c_cpp(code, is_cpp=False)
    if language == "cpp":
        return _run_c_cpp(code, is_cpp=True)
    if language == "java":
        return _run_java(code)

    return {
        "output": None,
        "error": f"Unsupported language: {language}",
    }
