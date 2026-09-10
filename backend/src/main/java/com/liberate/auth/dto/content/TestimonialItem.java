package com.liberate.auth.dto.content;

public class TestimonialItem {
    private String id;
    private String type;
    private String content;
    private String author;
    private String role;
    private String iconName;
    private String avatarColor;

    public TestimonialItem() {}

    public TestimonialItem(String id, String type, String content, String author, String role, String iconName, String avatarColor) {
        this.id = id;
        this.type = type;
        this.content = content;
        this.author = author;
        this.role = role;
        this.iconName = iconName;
        this.avatarColor = avatarColor;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    public String getAvatarColor() {
        return avatarColor;
    }

    public void setAvatarColor(String avatarColor) {
        this.avatarColor = avatarColor;
    }
}

