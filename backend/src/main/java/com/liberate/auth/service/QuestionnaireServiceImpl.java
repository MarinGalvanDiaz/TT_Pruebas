package com.liberate.auth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.liberate.auth.dto.questionnaire.QuestionnaireBatteryResponse;
import com.liberate.auth.dto.questionnaire.QuestionnaireItemDto;
import com.liberate.auth.dto.questionnaire.QuestionnaireProgressResponse;
import com.liberate.auth.dto.questionnaire.QuestionnaireResultResponse;
import com.liberate.auth.dto.questionnaire.SubmitQuestionnaireRequest;
import com.liberate.auth.entity.CuestionarioAdolescente;
import com.liberate.auth.entity.User;
import com.liberate.auth.exception.ResourceNotFoundException;
import com.liberate.auth.repository.CuestionarioAdolescenteRepository;
import com.liberate.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
public class QuestionnaireServiceImpl implements QuestionnaireService {

    private static final Logger logger = LoggerFactory.getLogger(QuestionnaireServiceImpl.class);

    private final CuestionarioAdolescenteRepository cuestionarioRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public QuestionnaireServiceImpl(CuestionarioAdolescenteRepository cuestionarioRepository,
                                    UserRepository userRepository,
                                    ObjectMapper objectMapper) {
        this.cuestionarioRepository = cuestionarioRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean hasCompletedInitialQuestionnaire(String userId) {
        return cuestionarioRepository.existsByUserIdAndEstadoEvaluacionIn(
                userId, List.of("COMPLETADO", "ALERTA_CRITICA")
        );
    }

    @Override
    public QuestionnaireBatteryResponse getInitialBattery() {
        return new QuestionnaireBatteryResponse(
                buildCmasr2Items(),
                buildBaiyItems(),
                buildEbisItems(),
                buildDerseItems()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionnaireProgressResponse getProgress(String userId) {
        Optional<CuestionarioAdolescente> existingOpt = cuestionarioRepository.findTopByUserIdOrderByCreatedAtDesc(userId);
        QuestionnaireProgressResponse response = new QuestionnaireProgressResponse();

        if (existingOpt.isEmpty()) {
            response.setCompleted(false);
            response.setStatus("SIN_INICIAR");
            response.setCurrentInstrumentIndex(0);
            response.setCurrentQuestionIndex(0);
            return response;
        }

        CuestionarioAdolescente record = existingOpt.get();
        String status = record.getEstadoEvaluacion();
        boolean isCompleted = "COMPLETADO".equals(status) || "ALERTA_CRITICA".equals(status);

        response.setCompleted(isCompleted);
        response.setStatus(status);
        response.setCurrentInstrumentIndex(record.getInstrumentoActual());
        response.setCurrentQuestionIndex(record.getPreguntaActual());
        response.setCmasr2Answers(parseAnswerMap(record.getCmasr2Respuestas()));
        response.setBaiyAnswers(parseAnswerMap(record.getBaiyRespuestas()));
        response.setEbisAnswers(parseAnswerMap(record.getEbisRespuestas()));
        response.setDerseAnswers(parseAnswerMap(record.getDerseRespuestas()));
        response.setUpdatedAt(record.getUpdatedAt());

        return response;
    }

    @Override
    @Transactional
    public QuestionnaireProgressResponse saveProgress(String userId, SubmitQuestionnaireRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + userId));

        CuestionarioAdolescente record = cuestionarioRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
                .orElseGet(() -> {
                    CuestionarioAdolescente nuevo = new CuestionarioAdolescente();
                    nuevo.setUser(user);
                    nuevo.setEstadoEvaluacion("EN_PROGRESO");
                    return nuevo;
                });

        // Si ya estaba completado anteriormente pero está re-editando en progreso, mantener o actualizar respuestas
        if (!"COMPLETADO".equals(record.getEstadoEvaluacion()) && !"ALERTA_CRITICA".equals(record.getEstadoEvaluacion())) {
            record.setEstadoEvaluacion("EN_PROGRESO");
        }

        Map<Integer, Integer> cmasr2 = request.getCmasr2Answers() != null ? request.getCmasr2Answers() : parseAnswerMap(record.getCmasr2Respuestas());
        Map<Integer, Integer> baiy = request.getBaiyAnswers() != null ? request.getBaiyAnswers() : parseAnswerMap(record.getBaiyRespuestas());
        Map<Integer, Integer> ebis = request.getEbisAnswers() != null ? request.getEbisAnswers() : parseAnswerMap(record.getEbisRespuestas());
        Map<Integer, Integer> derse = request.getDerseAnswers() != null ? request.getDerseAnswers() : parseAnswerMap(record.getDerseRespuestas());

        try {
            record.setCmasr2Respuestas(objectMapper.writeValueAsString(cmasr2));
            record.setBaiyRespuestas(objectMapper.writeValueAsString(baiy));
            record.setEbisRespuestas(objectMapper.writeValueAsString(ebis));
            record.setDerseRespuestas(objectMapper.writeValueAsString(derse));
        } catch (JsonProcessingException e) {
            logger.error("Error al serializar progreso de respuestas a JSON", e);
        }

        if (request.getCurrentInstrumentIndex() != null) {
            record.setInstrumentoActual(Math.max(0, Math.min(3, request.getCurrentInstrumentIndex())));
        }
        if (request.getCurrentQuestionIndex() != null) {
            record.setPreguntaActual(Math.max(0, request.getCurrentQuestionIndex()));
        }

        record.setUpdatedAt(Instant.now());
        cuestionarioRepository.save(record);

        QuestionnaireProgressResponse response = new QuestionnaireProgressResponse();
        response.setCompleted("COMPLETADO".equals(record.getEstadoEvaluacion()) || "ALERTA_CRITICA".equals(record.getEstadoEvaluacion()));
        response.setStatus(record.getEstadoEvaluacion());
        response.setCurrentInstrumentIndex(record.getInstrumentoActual());
        response.setCurrentQuestionIndex(record.getPreguntaActual());
        response.setCmasr2Answers(cmasr2);
        response.setBaiyAnswers(baiy);
        response.setEbisAnswers(ebis);
        response.setDerseAnswers(derse);
        response.setUpdatedAt(record.getUpdatedAt());

        return response;
    }

    private Map<Integer, Integer> parseAnswerMap(String json) {
        if (json == null || json.isBlank()) {
            return Collections.emptyMap();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<Map<Integer, Integer>>() {});
        } catch (Exception e) {
            logger.warn("No se pudo deserializar el mapa de respuestas: {}", e.getMessage());
            return Collections.emptyMap();
        }
    }

    @Override
    @Transactional
    public QuestionnaireResultResponse submitInitialQuestionnaire(String userId, SubmitQuestionnaireRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + userId));

        Map<Integer, Integer> cmasr2 = request.getCmasr2Answers() != null ? request.getCmasr2Answers() : Collections.emptyMap();
        Map<Integer, Integer> baiy = request.getBaiyAnswers() != null ? request.getBaiyAnswers() : Collections.emptyMap();
        Map<Integer, Integer> ebis = request.getEbisAnswers() != null ? request.getEbisAnswers() : Collections.emptyMap();
        Map<Integer, Integer> derse = request.getDerseAnswers() != null ? request.getDerseAnswers() : Collections.emptyMap();

        // 1. CMASR-2 Scoring
        int cmasr2Score = 0;
        int cmasr2DefScore = 0;
        int cmasr2IncScore = 0;
        Set<Integer> defItems = Set.of(14, 19, 24, 29, 33, 38);

        for (Map.Entry<Integer, Integer> entry : cmasr2.entrySet()) {
            int item = entry.getKey();
            int val = entry.getValue();
            if (val == 1) {
                cmasr2Score++;
            }
            if (defItems.contains(item) && val == 1) {
                cmasr2DefScore++;
            } else if (item == 48 && val == 0) { // Item 48: "He dicho alguna mentira" -> decir No indica defensividad
                cmasr2DefScore++;
            }
        }

        // 2. BAI-Y Scoring
        int baiyScore = 0;
        for (int val : baiy.values()) {
            baiyScore += val;
        }

        // 3. EBIS Scoring & Red Flag Detection
        int ebisScore = 0;
        boolean hasRedFlag = false;

        Integer ebis4 = ebis.get(4);
        Integer ebis5 = ebis.get(5);
        if ((ebis4 != null && ebis4 > 0) || (ebis5 != null && ebis5 > 0)) {
            hasRedFlag = true;
            logger.warn("🚨 ALERTA CRÍTICA: Ideación suicida activa detectada para usuario {}. Reactivo 4: {}, Reactivo 5: {}",
                    userId, ebis4, ebis5);
        }

        for (int val : ebis.values()) {
            ebisScore += val;
        }

        // 4. DERS-E Scoring & Item Inversion
        Set<Integer> invertedItems = Set.of(1, 2, 6, 7, 9);
        Set<Integer> f1Items = Set.of(10, 11, 12, 14, 15, 21, 22, 23, 24);
        Set<Integer> f2Items = Set.of(13, 16, 17, 18, 19, 20);
        Set<Integer> f3Items = Set.of(1, 2, 6, 7, 9);
        Set<Integer> f4Items = Set.of(3, 4, 5, 8);

        int derseScore = 0;
        int f1Score = 0;
        int f2Score = 0;
        int f3Score = 0;
        int f4Score = 0;

        for (Map.Entry<Integer, Integer> entry : derse.entrySet()) {
            int item = entry.getKey();
            int rawVal = entry.getValue();
            int finalVal = invertedItems.contains(item) ? (6 - rawVal) : rawVal;

            derseScore += finalVal;
            if (f1Items.contains(item)) f1Score += finalVal;
            else if (f2Items.contains(item)) f2Score += finalVal;
            else if (f3Items.contains(item)) f3Score += finalVal;
            else if (f4Items.contains(item)) f4Score += finalVal;
        }

        // 5. Persistir Cuestionario (reutilizando registro EN_PROGRESO si existe)
        CuestionarioAdolescente record = cuestionarioRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
                .orElseGet(() -> {
                    CuestionarioAdolescente nuevo = new CuestionarioAdolescente();
                    nuevo.setUser(user);
                    return nuevo;
                });

        try {
            record.setCmasr2Respuestas(objectMapper.writeValueAsString(cmasr2));
            record.setBaiyRespuestas(objectMapper.writeValueAsString(baiy));
            record.setEbisRespuestas(objectMapper.writeValueAsString(ebis));
            record.setDerseRespuestas(objectMapper.writeValueAsString(derse));
        } catch (JsonProcessingException e) {
            logger.error("Error al serializar respuestas a JSON", e);
        }

        record.setCmasr2Score(cmasr2Score);
        record.setCmasr2DefScore(cmasr2DefScore);
        record.setCmasr2IncScore(cmasr2IncScore);
        record.setBaiyScore(baiyScore);
        record.setEbisScore(ebisScore);
        record.setEbisBanderaRoja(hasRedFlag);
        record.setDerseScore(derseScore);
        record.setDerseF1(f1Score);
        record.setDerseF2(f2Score);
        record.setDerseF3(f3Score);
        record.setDerseF4(f4Score);
        record.setInstrumentoActual(3);
        record.setPreguntaActual(23);
        record.setEstadoEvaluacion(hasRedFlag ? "ALERTA_CRITICA" : "COMPLETADO");
        record.setUpdatedAt(Instant.now());

        cuestionarioRepository.save(record);

        // Actualizar usuario
        user.setEvaluacionInicialCompletada(true);
        userRepository.save(user);

        // 6. Preparar Respuesta
        QuestionnaireResultResponse response = new QuestionnaireResultResponse();
        response.setStatus(hasRedFlag ? "ALERTA_CRITICA" : "COMPLETADO");
        response.setHasRedFlag(hasRedFlag);
        response.setCmasr2Score(cmasr2Score);
        response.setCmasr2DefScore(cmasr2DefScore);
        response.setCmasr2IncScore(cmasr2IncScore);
        response.setBaiyScore(baiyScore);
        response.setEbisScore(ebisScore);
        response.setDerseScore(derseScore);
        response.setDerseF1(f1Score);
        response.setDerseF2(f2Score);
        response.setDerseF3(f3Score);
        response.setDerseF4(f4Score);

        if (hasRedFlag) {
            response.setMessage("Se ha detectado una situación que requiere atención prioritaria. Estamos aquí para apoyarte.");
        } else {
            response.setMessage("Evaluación inicial completada exitosamente. Bienvenido/a a Libérate.");
        }

        return response;
    }

    private List<QuestionnaireItemDto> buildCmasr2Items() {
        List<QuestionnaireItemDto.OptionDto> options = List.of(
                new QuestionnaireItemDto.OptionDto("Sí", 1),
                new QuestionnaireItemDto.OptionDto("No", 0)
        );

        String[] questions = {
                "Muchas veces siento asco o náuseas.",
                "Soy muy nervioso(a).",
                "Muchas veces me preocupa que algo malo me pase.",
                "Tengo miedo que otros niños se rían de mí durante la clase.",
                "Tengo demasiados dolores de cabeza.",
                "Me preocupa no agradarle a los otros.",
                "Algunas veces me despierto asustado(a).",
                "La gente me pone nervioso(a).",
                "Siento que alguien va a decirme que hago mal las cosas.",
                "Tengo miedo que los demás se rían de mí.",
                "Me cuesta trabajo tomar decisiones.",
                "Me pongo nervioso(a) cuando las cosas no me salen como quiero.",
                "Parece que las cosas son más fáciles para los demás que para mí.",
                "Todas las personas que conozco me caen bien. [DEF]",
                "Muchas veces siento que me falta el aire.",
                "Casi todo el tiempo estoy preocupado(a).",
                "Me siento mal si la gente se ríe de mí.",
                "Muchas cosas me dan miedo.",
                "Siempre soy amable. [DEF]",
                "Me enojo con facilidad.",
                "Me preocupa lo que mis papás me vayan a decir.",
                "Siento que a los demás no les gusta cómo hago las cosas.",
                "Me da miedo hablar en voz alta ante mis compañeros.",
                "Siempre me porto bien. [DEF]",
                "En las noches me cuesta trabajo quedarme dormido(a).",
                "Me preocupa lo que la gente piense de mí. [INC]",
                "Me siento solo(a) aunque esté acompañado(a).",
                "En la escuela se burlan de mí.",
                "Siempre soy bueno(a). [DEF]",
                "Es muy fácil herir mis sentimientos.",
                "Me sudan las manos.",
                "Me preocupa cometer errores delante de la gente.",
                "Siempre soy agradable con todos. [DEF]",
                "Me canso mucho.",
                "Me preocupa lo que va a pasar.",
                "Los demás son más felices que yo.",
                "Temo hablar en voz alta delante de un grupo.",
                "Siempre digo la verdad. [DEF]",
                "Tengo pesadillas.",
                "A veces me enojo.",
                "Me preocupa que durante la clase me hagan participar.",
                "Me siento preocupado(a) cuando me voy a dormir en la noche.",
                "Me cuesta trabajo concentrarme en mis tareas escolares.",
                "A veces digo cosas que no debería decir.",
                "Me preocupa que alguien me dé una golpiza.",
                "Me muevo mucho en mi asiento.",
                "Muchas personas están en mi contra.",
                "He dicho alguna mentira. [DEF]",
                "Me preocupa decir alguna tontería."
        };

        List<QuestionnaireItemDto> list = new ArrayList<>();
        for (int i = 0; i < questions.length; i++) {
            int num = i + 1;
            String text = questions[i];
            String subscale = text.contains("[DEF]") ? "DEF" : (text.contains("[INC]") ? "INC" : "General");
            list.add(new QuestionnaireItemDto(num, "CMASR2", text.replace(" [DEF]", "").replace(" [INC]", ""),
                    "YES_NO", options, subscale, false, false));
        }
        return list;
    }

    private List<QuestionnaireItemDto> buildBaiyItems() {
        List<QuestionnaireItemDto.OptionDto> options = List.of(
                new QuestionnaireItemDto.OptionDto("Nunca", 0),
                new QuestionnaireItemDto.OptionDto("A veces", 1),
                new QuestionnaireItemDto.OptionDto("A menudo", 2),
                new QuestionnaireItemDto.OptionDto("Siempre", 3)
        );

        String[] questions = {
                "Me preocupo por las cosas.",
                "Siento que me falta el aire.",
                "Siento miedo de que pase algo malo.",
                "Me siento mareado/a o a punto de desmayarme.",
                "Me sudan las manos.",
                "Siento que mi corazón late muy rápido.",
                "Me siento tembloroso/a.",
                "Me preocupo por lo que otras personas piensan de mí.",
                "Me asusto fácilmente.",
                "Siento hormigueos.",
                "Me preocupo por la escuela o por mis calificaciones.",
                "Siento miedo.",
                "Me siento nervioso/a.",
                "Me siento inquieto/a (no puedo quedarme quieto/a).",
                "Siento un nudo en el estómago o me duele la panza.",
                "Tengo pesadillas.",
                "Me preocupo por mi salud o por enfermarme.",
                "Siento tensión en mis músculos.",
                "Me preocupo por cometer errores.",
                "Siento que las cosas no son reales (como en un sueño)."
        };

        List<QuestionnaireItemDto> list = new ArrayList<>();
        for (int i = 0; i < questions.length; i++) {
            list.add(new QuestionnaireItemDto(i + 1, "BAI-Y", questions[i],
                    "LIKERT_0_3", options, "Ansiedad", false, false));
        }
        return list;
    }

    private List<QuestionnaireItemDto> buildEbisItems() {
        List<QuestionnaireItemDto> list = new ArrayList<>();

        list.add(new QuestionnaireItemDto(1, "EBIS", "Deseo de vivir", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("Moderado a fuerte", 0),
                        new QuestionnaireItemDto.OptionDto("Débil", 1),
                        new QuestionnaireItemDto.OptionDto("Inexistente", 2)), "Ideación", false, false));

        list.add(new QuestionnaireItemDto(2, "EBIS", "Deseo de morir", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("Ninguno", 0),
                        new QuestionnaireItemDto.OptionDto("Pocos deseos", 1),
                        new QuestionnaireItemDto.OptionDto("Moderado a fuerte", 2)), "Ideación", false, false));

        list.add(new QuestionnaireItemDto(3, "EBIS", "Razones para vivir frente a razones para morir", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("Más razones para vivir", 0),
                        new QuestionnaireItemDto.OptionDto("Igual para vivir que para morir", 1),
                        new QuestionnaireItemDto.OptionDto("Más razones para morir", 2)), "Ideación", false, false));

        // Reactivo 4: CRÍTICO
        list.add(new QuestionnaireItemDto(4, "EBIS", "Deseo de intento de suicidio activo", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("Ninguno", 0),
                        new QuestionnaireItemDto.OptionDto("Débil", 1),
                        new QuestionnaireItemDto.OptionDto("Moderado a fuerte", 2)), "Crítico", true, false));

        // Reactivo 5: CRÍTICO (Regla de salto: si 4 y 5 son 0, la prueba concluye)
        list.add(new QuestionnaireItemDto(5, "EBIS", "Intento de suicidio pasivo / precauciones para salvar la vida", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("Tomaría precauciones para salvar mi vida", 0),
                        new QuestionnaireItemDto.OptionDto("Dejaría la vida o muerte al azar", 1),
                        new QuestionnaireItemDto.OptionDto("Evitaría tomar precauciones para salvar mi vida", 2)), "Crítico", true, false));

        list.add(new QuestionnaireItemDto(6, "EBIS", "Duración de pensamientos o deseos de morir", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("Breves o pasajeros", 0),
                        new QuestionnaireItemDto.OptionDto("Periodos regulares de tiempo", 1),
                        new QuestionnaireItemDto.OptionDto("Continuos o casi continuos", 2)), "Planificación", false, false));

        list.add(new QuestionnaireItemDto(7, "EBIS", "Frecuencia de pensamientos suicidas", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("Raras ocasiones", 0),
                        new QuestionnaireItemDto.OptionDto("Frecuentes", 1),
                        new QuestionnaireItemDto.OptionDto("Muy frecuentes / Continuos", 2)), "Planificación", false, false));

        list.add(new QuestionnaireItemDto(8, "EBIS", "Actitud hacia los pensamientos suicidas", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("Los rechazo totalmente", 0),
                        new QuestionnaireItemDto.OptionDto("Sentimientos encontrados (ambivalente)", 1),
                        new QuestionnaireItemDto.OptionDto("Los acepto", 2)), "Planificación", false, false));

        list.add(new QuestionnaireItemDto(9, "EBIS", "Control sobre la acción o deseo de suicidio", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("Tengo control total", 0),
                        new QuestionnaireItemDto.OptionDto("Poco control", 1),
                        new QuestionnaireItemDto.OptionDto("Ningún control", 2)), "Planificación", false, false));

        list.add(new QuestionnaireItemDto(10, "EBIS", "Razones o motivos que detienen la tentativa (familia, amigos, planes)", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("Motivos fuertes para no hacerlo", 0),
                        new QuestionnaireItemDto.OptionDto("Motivos débiles", 1),
                        new QuestionnaireItemDto.OptionDto("Ningún motivo para detenerme", 2)), "Planificación", false, false));

        list.add(new QuestionnaireItemDto(11, "EBIS", "Razones para pensar en el intento (escapar, terminar problemas)", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("Ninguna", 0),
                        new QuestionnaireItemDto.OptionDto("Aliviar una situación o pedir ayuda", 1),
                        new QuestionnaireItemDto.OptionDto("Acabar por completo con todo", 2)), "Planificación", false, false));

        list.add(new QuestionnaireItemDto(12, "EBIS", "El método: Especificidad y planificación del intento", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("No he pensado en ningún método", 0),
                        new QuestionnaireItemDto.OptionDto("He considerado un método pero sin detalles", 1),
                        new QuestionnaireItemDto.OptionDto("Tengo un plan específico y detallado", 2)), "Planificación", false, false));

        list.add(new QuestionnaireItemDto(13, "EBIS", "El método: Disponibilidad u oportunidad real", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("El método no está a mi alcance", 0),
                        new QuestionnaireItemDto.OptionDto("Tomaría tiempo o esfuerzo conseguirlo", 1),
                        new QuestionnaireItemDto.OptionDto("Tengo el método inmediatamente a mi alcance", 2)), "Planificación", false, false));

        list.add(new QuestionnaireItemDto(14, "EBIS", "Sensación de valor o capacidad para llevar a cabo el intento", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("No tengo valor / Me asusta demasiado", 0),
                        new QuestionnaireItemDto.OptionDto("Incierto(a) de si me atrevería", 1),
                        new QuestionnaireItemDto.OptionDto("Seguro(a) de mi valor y decisión", 2)), "Planificación", false, false));

        list.add(new QuestionnaireItemDto(15, "EBIS", "Expectativa o certeza de un intento real", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("No espero realizarlo", 0),
                        new QuestionnaireItemDto.OptionDto("Es probable que suceda", 1),
                        new QuestionnaireItemDto.OptionDto("Estoy seguro(a) de que lo intentaré", 2)), "Planificación", false, false));

        list.add(new QuestionnaireItemDto(16, "EBIS", "Preparación real (guardar pastillas, conseguir objetos)", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("Ninguna preparación", 0),
                        new QuestionnaireItemDto.OptionDto("Preparación parcial o inicial", 1),
                        new QuestionnaireItemDto.OptionDto("Preparación completa finalizada", 2)), "Planificación", false, false));

        list.add(new QuestionnaireItemDto(17, "EBIS", "Nota de despedida escrita o pensada", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("Ninguna", 0),
                        new QuestionnaireItemDto.OptionDto("Pensada pero no escrita", 1),
                        new QuestionnaireItemDto.OptionDto("Escrita o comenzada", 2)), "Planificación", false, false));

        list.add(new QuestionnaireItemDto(18, "EBIS", "Acciones finales (regalar pertenencias, despedirse)", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("Ninguna", 0),
                        new QuestionnaireItemDto.OptionDto("He pensado en algunos arreglos", 1),
                        new QuestionnaireItemDto.OptionDto("He regalado pertenencias o dejado arreglos", 2)), "Planificación", false, false));

        list.add(new QuestionnaireItemDto(19, "EBIS", "Ocultamiento de la idea de suicidio", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("He hablado abiertamente de ello", 0),
                        new QuestionnaireItemDto.OptionDto("He evitado tocar el tema", 1),
                        new QuestionnaireItemDto.OptionDto("He ocultado y engañado activamente sobre ello", 2)), "Planificación", false, false));

        list.add(new QuestionnaireItemDto(20, "EBIS", "Intentos de suicidio anteriores", "EBIS_OPTIONS",
                List.of(new QuestionnaireItemDto.OptionDto("Ningún intento previo", 0),
                        new QuestionnaireItemDto.OptionDto("Un intento en el pasado", 1),
                        new QuestionnaireItemDto.OptionDto("Dos o más intentos previos", 2)), "Historial", false, false));

        return list;
    }

    private List<QuestionnaireItemDto> buildDerseItems() {
        List<QuestionnaireItemDto.OptionDto> options = List.of(
                new QuestionnaireItemDto.OptionDto("Casi nunca (0-10%)", 1),
                new QuestionnaireItemDto.OptionDto("A veces (11-35%)", 2),
                new QuestionnaireItemDto.OptionDto("La mitad del tiempo (36-65%)", 3),
                new QuestionnaireItemDto.OptionDto("La mayoría de las veces (66-90%)", 4),
                new QuestionnaireItemDto.OptionDto("Casi siempre (91-100%)", 5)
        );

        String[] questions = {
                "Tengo claros mis sentimientos",
                "Pongo atención a cómo me siento",
                "Mis emociones me sobrepasan y están fuera de control",
                "No tengo idea de cómo me siento",
                "Me cuesta trabajo entender por qué me siento como me siento",
                "Le hago caso a mis sentimientos",
                "Sé exactamente cómo me siento",
                "Estoy confundido/a por cómo me siento",
                "Cuando me siento mal puedo reconocer cómo me siento",
                "Me enojo conmigo mismo por sentirme de esa manera",
                "Creo que así me sentiré por mucho tiempo",
                "Siento que soy débil",
                "Me cuesta trabajo hacer mis deberes",
                "Me siento culpable por sentirme de esa manera",
                "Creo que no hay nada que pueda hacer para sentirme mejor",
                "Me cuesta trabajo ocuparme de otras cosas",
                "Me cuesta trabajo concentrarme",
                "Me cuesta trabajo controlar lo que hago",
                "Pierdo el control de cómo me porto",
                "Se me dificulta pensar en algo más",
                "Me molesto conmigo mismo/a por sentirme de esa manera",
                "Me empiezo a sentir muy mal conmigo mismo/a",
                "Creo que no puedo hacer otra cosa que dejarme llevar",
                "Me toma mucho tiempo sentirme mejor"
        };

        Set<Integer> inverted = Set.of(1, 2, 6, 7, 9);
        Set<Integer> f1 = Set.of(10, 11, 12, 14, 15, 21, 22, 23, 24);
        Set<Integer> f2 = Set.of(13, 16, 17, 18, 19, 20);
        Set<Integer> f3 = Set.of(1, 2, 6, 7, 9);
        Set<Integer> f4 = Set.of(3, 4, 5, 8);

        List<QuestionnaireItemDto> list = new ArrayList<>();
        for (int i = 0; i < questions.length; i++) {
            int num = i + 1;
            boolean isInverted = inverted.contains(num);
            String factor = f1.contains(num) ? "F1. No Aceptación"
                    : (f2.contains(num) ? "F2. Metas / Impulsos"
                    : (f3.contains(num) ? "F3. Conciencia" : "F4. Claridad"));

            list.add(new QuestionnaireItemDto(num, "DERS-E", questions[i],
                    "LIKERT_1_5", options, factor, false, isInverted));
        }
        return list;
    }
}
