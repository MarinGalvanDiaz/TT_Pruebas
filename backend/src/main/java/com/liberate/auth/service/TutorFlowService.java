package com.liberate.auth.service;

import com.liberate.auth.dto.tutor.*;

public interface TutorFlowService {

    TutorFlowStatusResponse initiateTutorInvite(InviteTutorRequest request);

    TutorFlowStatusResponse resendTutorInvite(String token);

    TutorFlowStatusResponse getStatusByToken(String token);

    TutorFlowStatusResponse confirmTutorData(ConfirmTutorDataRequest request);

    TutorFlowStatusResponse processConsent(TutorConsentRequest request, String clientIp);

    TutorFlowStatusResponse processBlockA(TutorBlockARequest request);

    TutorFlowStatusResponse processBlockB(TutorBlockBRequest request);

    TutorFlowStatusResponse processSymptoms(TutorSymptomsRequest request);

    TutorFlowStatusResponse completeFlowAndUnlockAdolescent(String token);

    void sendDirectoryToEmail(SendDirectoryRequest request);
}

