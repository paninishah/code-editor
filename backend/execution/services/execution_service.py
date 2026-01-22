import requests
import time

# Official Judge0 CE instance
JUDGE0_URL = "https://ce.judge0.com"


HEADERS = {
    "Content-Type": "application/json"
}


def submit_code(source_code: str, language_id: int) -> str:
    """
    Sends code to Judge0 for execution.
    Returns a submission token.
    """
    response = requests.post(
        f"{JUDGE0_URL}/submissions",
        headers=HEADERS,
        params={
            "base64_encoded": "false",
            "wait": "false"
        },
        json={
            "source_code": source_code,
            "language_id": language_id
        }
    )

    response.raise_for_status()
    return response.json()["token"]


def get_result(token: str) -> dict:
    """
    Polls Judge0 until execution finishes.
    Returns final execution result.
    """
    while True:
        response = requests.get(
            f"{JUDGE0_URL}/submissions/{token}",
            headers=HEADERS,
            params={"base64_encoded": "false"}
        )

        response.raise_for_status()
        result = response.json()

        # Status IDs:
        # 1 = In Queue
        # 2 = Processing
        if result["status"]["id"] in [1, 2]:
            time.sleep(1)
            continue

        return result
