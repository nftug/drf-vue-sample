from rest_framework import serializers
from django.contrib.auth import get_user_model
from djoser.serializers import UserSerializer
from djoser.conf import settings

from shop.models import Book


User = get_user_model()


class CustomUserSerializer(UserSerializer):
    class Meta:
        model = User
        fields = tuple(User.REQUIRED_FIELDS) + (
            settings.USER_ID_FIELD,
            settings.LOGIN_FIELD,
            'is_superuser'
        )
        read_only_fields = (settings.LOGIN_FIELD, 'is_superuser')


class BookSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    
    class Meta:
        model = Book
        fields = ['id', 'title', 'price', 'created_by', 'username']
        extra_kwargs = {'created_by': {'required': False, 'write_only': True}}

    def get_username(self, instance):
        if instance.created_by is None:
            return None
        return instance.created_by.username
        
    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("価格は0以上を指定してください。")
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['created_by'] = user
        return super().create(validated_data)
