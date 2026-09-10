package com.liberate.auth.controller;

import com.liberate.auth.dto.content.FaqItem;
import com.liberate.auth.dto.content.PartnerItem;
import com.liberate.auth.dto.content.TestimonialItem;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/content")
public class ContentController {

    private static final List<FaqItem> FAQS = List.of(
            new FaqItem("faq-1", "¿Qué es Libérate y en qué consiste el proyecto?",
                    "Libérate es una iniciativa de investigación y desarrollo tecnológico enfocada en la prevención y el acompañamiento emocional de adolescentes y sus familias, ofreciendo herramientas accesibles y contenidos especializados.",
                    "General"),
            new FaqItem("faq-2", "¿Es completamente anónimo y confidencial?",
                    "Sí, la privacidad es fundamental. Los registros personales y actividades emocionales se gestionan bajo estrictos protocolos de protección de datos.",
                    "Privacidad"),
            new FaqItem("faq-3", "¿Quiénes respaldan la investigación?",
                    "Cuenta con la colaboración y respaldo de investigadoras e investigadores de la UNAM, el IPN y el LABPSIIT, gracias al Programa UNAM-PAPIME (PE309026).",
                    "Institucional"),
            new FaqItem("faq-4", "¿Cómo puedo acceder desde mi celular?",
                    "Puedes usar esta versión web responsiva directamente en cualquier navegador o descargar la app disponible para iOS en App Store y para Android en Google Play.",
                    "Uso")
    );

    private static final List<TestimonialItem> TESTIMONIALS = List.of(
            new TestimonialItem("test-1", "Experiencia",
                    "Testimonio de una familia sobre su experiencia con Libérate: Nos ha brindado herramientas claras para comunicarnos mejor y comprender los momentos difíciles sin juzgarnos.",
                    "Familia Martínez", "Familia participante", "people", "#b4d2b6"),
            new TestimonialItem("test-2", "Experiencia",
                    "Testimonio de un profesional sobre su experiencia con Libérate: Es un recurso clínico y pedagógico invaluable para el acompañamiento socioemocional y la psicoeducación.",
                    "Dra. Gabriela Soto", "Profesional en Psicología Clínica", "psychology", "#b5e7fe"),
            new TestimonialItem("test-3", "Experiencia",
                    "Encontrar ejercicios de respiración guiada y lecturas pensadas para lo que sentimos me ayudó a recuperar la calma en momentos de mucha presión escolar.",
                    "Mateo R.", "Adolescente (16 años)", "face", "#d1c4e9")
    );

    private static final List<PartnerItem> PARTNERS = List.of(
            new PartnerItem("p-unam", "Universidad Nacional Autónoma de México", "UNAM",
                    "Facultad de Psicología y Dirección General de Asuntos del Personal Académico (DGAPA)",
                    "https://www.unam.mx"),
            new PartnerItem("p-ipn", "Instituto Politécnico Nacional", "IPN",
                    "Investigación y Colaboración Tecnológica Interinstitucional",
                    "https://www.ipn.mx"),
            new PartnerItem("p-labpsiit", "Laboratorio de Psicología e Innovación Tecnológica", "LABPSIIT",
                    "Desarrollo de Soluciones Digitales en Salud Mental",
                    "https://labpsiit.unam.mx")
    );

    @GetMapping("/faqs")
    public ResponseEntity<List<FaqItem>> getFaqs() {
        return ResponseEntity.ok(FAQS);
    }

    @GetMapping("/testimonials")
    public ResponseEntity<List<TestimonialItem>> getTestimonials() {
        return ResponseEntity.ok(TESTIMONIALS);
    }

    @GetMapping("/partners")
    public ResponseEntity<List<PartnerItem>> getPartners() {
        return ResponseEntity.ok(PARTNERS);
    }
}

