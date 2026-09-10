package com.liberate.auth.dto.content;

public class PartnerItem {
    private String id;
    private String name;
    private String logoText;
    private String description;
    private String websiteUrl;

    public PartnerItem() {}

    public PartnerItem(String id, String name, String logoText, String description, String websiteUrl) {
        this.id = id;
        this.name = name;
        this.logoText = logoText;
        this.description = description;
        this.websiteUrl = websiteUrl;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogoText() {
        return logoText;
    }

    public void setLogoText(String logoText) {
        this.logoText = logoText;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }
}

