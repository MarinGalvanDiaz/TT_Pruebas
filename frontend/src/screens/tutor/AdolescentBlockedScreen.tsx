import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { FloatingInput } from '../../components/common/FloatingInput';
import { GradientButton } from '../../components/common/GradientButton';
import EmergencyDirectoryModal from '../../components/modules/EmergencyDirectoryModal';
import { TutorService } from '../../services/tutor.service';

export default function AdolescentBlockedScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const initialName = route.params?.nombre || '';
  const initialAge = route.params?.edad ? String(route.params.edad) : '15';
  const initialEmail = route.params?.email || '';

  const [nombre, setNombre] = useState(initialName);
  const [edad, setEdad] = useState(initialAge);
  const [tutorEmail, setTutorEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDirectory, setShowDirectory] = useState(false);

  const handleSendInvite = async () => {
    setErrorMessage(null);

    if (!nombre.trim()) {
      setErrorMessage('Por favor escribe tu nombre');
      return;
    }

    const ageNum = parseInt(edad, 10);
    if (isNaN(ageNum) || ageNum < 12 || ageNum > 17) {
      setErrorMessage('Este protocolo está dirigido a adolescentes de 12 a 17 años');
      return;
    }

    if (!tutorEmail.trim() || !tutorEmail.includes('@')) {
      setErrorMessage('Ingresa un correo válido para tu tutor legal');
      return;
    }

    if (initialEmail && tutorEmail.trim().toLowerCase() === initialEmail.trim().toLowerCase()) {
      setErrorMessage('El correo de tu tutor no puede ser igual a tu propio correo');
      return;
    }

    setLoading(true);
    try {
      const response = await TutorService.initiateInvite({
        nombreAdolescente: nombre.trim(),
        edadAdolescente: ageNum,
        emailTutor: tutorEmail.trim().toLowerCase(),
        emailAdolescente: initialEmail.trim().toLowerCase() || undefined,
      });

      navigation.navigate('TutorInvitationSent', {
        token: response.token,
        emailTutor: tutorEmail.trim().toLowerCase(),
        adolescenteNombre: nombre.trim(),
        adolescenteEmail: initialEmail.trim().toLowerCase(),
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'No se pudo enviar la invitación al tutor. Intenta de nuevo.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* Badge Icon */}
          <View style={styles.iconCircle}>
            <Ionicons name="people-outline" size={36} color={Colors.primary} />
          </View>

          <Text style={styles.title}>Requerimos autorización de tu tutor</Text>
          <Text style={styles.subtitle}>
            UNAM · IPN · LABPSIIT • Protocolo PAPIME PE309026
          </Text>

          <View style={styles.infoBanner}>
            <Ionicons name="information-circle" size={20} color={Colors.primary} style={{ marginRight: 10 }} />
            <Text style={styles.infoBannerText}>
              Por ser menor de 18 años, la legislación y comités de ética requieren el consentimiento informado de tu madre, padre o tutor legal para que puedas acceder a Libérate.
            </Text>
          </View>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={Colors.error} style={{ marginRight: 6 }} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.formSection}>
            <FloatingInput
              label="Tu nombre"
              value={nombre}
              onChangeText={(t: string) => {
                setNombre(t);
                setErrorMessage(null);
              }}
              autoCapitalize="words"
            />

            <FloatingInput
              label="Tu edad (12 a 17 años)"
              value={edad}
              onChangeText={(t: string) => {
                setEdad(t);
                setErrorMessage(null);
              }}
              keyboardType="numeric"
              maxLength={2}
            />

            <FloatingInput
              label="Correo electrónico de tu mamá, papá o tutor"
              value={tutorEmail}
              onChangeText={(t: string) => {
                setTutorEmail(t);
                setErrorMessage(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              hint="Le enviaremos un correo con un enlace para autorizar tu cuenta."
            />
          </View>

          <View style={styles.buttonContainer}>
            <GradientButton
              title="Enviarle la invitación"
              onPress={handleSendInvite}
              loading={loading}
            />
          </View>

          {/* Emergency Crisis Link */}
          <TouchableOpacity
            style={styles.emergencyLink}
            onPress={() => setShowDirectory(true)}
          >
            <Ionicons name="heart-circle-outline" size={20} color={Colors.secondary} style={{ marginRight: 6 }} />
            <Text style={styles.emergencyLinkText}>
              ¿Necesitas ayuda inmediata? Consulta nuestro Directorio de Crisis
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.backLinkText}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>

        <EmergencyDirectoryModal
          visible={showDirectory}
          onClose={() => setShowDirectory(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 24,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 540,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    alignItems: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryContainer + '50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.headlineMedium,
    color: Colors.onSurface,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoBannerText: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    flex: 1,
    lineHeight: 20,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorContainer + '60',
    padding: 12,
    borderRadius: 12,
    marginBottom: Spacing.md,
    width: '100%',
  },
  errorText: {
    ...Typography.bodySmall,
    color: Colors.error,
    fontWeight: '600',
    flex: 1,
  },
  formSection: {
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    marginTop: Spacing.md,
  },
  emergencyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.secondaryContainer + '40',
    borderRadius: 10,
  },
  emergencyLinkText: {
    ...Typography.bodySmall,
    color: Colors.secondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  backLink: {
    marginTop: Spacing.md,
    padding: 6,
  },
  backLinkText: {
    ...Typography.labelMedium,
    color: Colors.onSurfaceVariant,
  },
});
