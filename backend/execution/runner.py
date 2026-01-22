from .services.execution_service import submit_code, get_result


LANGUAGE_MAP = {
    "python": 71,
    "cpp": 54,
    "c": 50,
    "java": 62,
    "javascript": 63,
}


def run(code: str, language: str) -> dict:
    # Validate supported language
    if language not in LANGUAGE_MAP:
        return {
            "output": None,
            "error": f"Unsupported language: {language}"
        }

    try:
        # Submit code to Judge0
        token = submit_code(code, LANGUAGE_MAP[language])

        # Poll for result
        result = get_result(token)

        # Normalize error handling
        error = (
            result.get("stderr")
            or result.get("compile_output")
            or result.get("message")
        )

        return {
            "output": result.get("stdout"),
            "error": error
        }

    except Exception as e:
        return {
            "output": None,
            "error": str(e)
        }
