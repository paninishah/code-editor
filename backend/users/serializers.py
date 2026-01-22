from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken


def generate_jwt(user):
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)


class SignupSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"]
        )
        token = generate_jwt(user)
        return {
            "token": token,
            "username": user.username
        }


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data["username"],
            password=data["password"]
        )
        if not user:
            raise AuthenticationFailed("Invalid credentials")

        token = generate_jwt(user)
        return {
            "token": token,
            "username": user.username
        }
