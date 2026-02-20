from project_starter import greet


def test_greet_default() -> None:
    assert greet() == "Hello, world!"


def test_greet_custom_name() -> None:
    assert greet("friend") == "Hello, friend!"
