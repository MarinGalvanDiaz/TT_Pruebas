package com.liberate.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.liberate.auth.dto.request.LoginRequest;
import com.liberate.auth.dto.request.RegisterRequest;
import com.liberate.auth.entity.UserRole;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Integration Test: Complete flow of Register -> Login")
    void testRegisterAndLoginFlow() throws Exception {
        String email = "test." + System.currentTimeMillis() + "@liberate.org";
        RegisterRequest registerReq = new RegisterRequest("Sofia Test", email, "Password123!", UserRole.ADOLESCENTES);

        // 1. Register
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value(email));

        // 2. Login
        LoginRequest loginReq = new LoginRequest(email, "Password123!", UserRole.ADOLESCENTES);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value(email));
    }

    @Test
    @DisplayName("Integration Test: Login with wrong password returns 401 and generic message")
    void testLoginWithWrongPassword() throws Exception {
        LoginRequest loginReq = new LoginRequest("unknown@liberate.org", "WrongPassword123", UserRole.ADOLESCENTES);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Credenciales inválidas"))
                .andExpect(jsonPath("$.code").value("INVALID_CREDENTIALS"));
    }
}
