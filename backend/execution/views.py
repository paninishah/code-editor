from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .runner import run

@api_view(['POST'])
def run_code(request):
    code = request.data.get("code")
    language = request.data.get("language")

    if not code or not language:
        return Response(
            {"error": "code and language are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    result = run(code, language)
    return Response(result)
