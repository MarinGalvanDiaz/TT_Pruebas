package com.liberate.auth.dto.questionnaire;

import java.util.List;

public class QuestionnaireItemDto {

    private int id;
    private String instrument;
    private String text;
    private String scaleType;
    private List<OptionDto> options;
    private String subscale;
    private boolean isCritical;
    private boolean isInverted;

    public QuestionnaireItemDto() {}

    public QuestionnaireItemDto(int id, String instrument, String text, String scaleType,
                                List<OptionDto> options, String subscale, boolean isCritical, boolean isInverted) {
        this.id = id;
        this.instrument = instrument;
        this.text = text;
        this.scaleType = scaleType;
        this.options = options;
        this.subscale = subscale;
        this.isCritical = isCritical;
        this.isInverted = isInverted;
    }

    public static class OptionDto {
        private String label;
        private int value;

        public OptionDto() {}

        public OptionDto(String label, int value) {
            this.label = label;
            this.value = value;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public int getValue() {
            return value;
        }

        public void setValue(int value) {
            this.value = value;
        }
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getInstrument() {
        return instrument;
    }

    public void setInstrument(String instrument) {
        this.instrument = instrument;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getScaleType() {
        return scaleType;
    }

    public void setScaleType(String scaleType) {
        this.scaleType = scaleType;
    }

    public List<OptionDto> getOptions() {
        return options;
    }

    public void setOptions(List<OptionDto> options) {
        this.options = options;
    }

    public String getSubscale() {
        return subscale;
    }

    public void setSubscale(String subscale) {
        this.subscale = subscale;
    }

    public boolean isCritical() {
        return isCritical;
    }

    public void setCritical(boolean critical) {
        isCritical = critical;
    }

    public boolean isInverted() {
        return isInverted;
    }

    public void setInverted(boolean inverted) {
        isInverted = inverted;
    }
}

