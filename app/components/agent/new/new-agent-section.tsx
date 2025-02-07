"use client";

import { Agent } from "@/mongodb/models/agent";
import { NewAgentStep1Data } from "@/types/new-agent-step-1-data";
import { NewAgentStep2Data } from "@/types/new-agent-step-2-data";
import { NewAgentStep3Data } from "@/types/new-agent-step-3-data";
import { NewAgentStep4Data } from "@/types/new-agent-step-4-data";
import { NewAgentStep5Data } from "@/types/new-agent-step-5-data";
import { useState } from "react";
import { NewAgentStep1Section } from "./new-agent-step-1-section";
import { NewAgentStep2Section } from "./new-agent-step-2-section";
import { NewAgentStep3Section } from "./new-agent-step-3-section";
import { NewAgentStep4Section } from "./new-agent-step-4-section";
import { NewAgentStep5Section } from "./new-agent-step-5-section";
import { NewAgentFinalStepSection } from "./new-agent-step-final-section";
import { NewAgentCreatedSection } from "./new-agent-created-section";

export function NewAgentSection() {
  const [step1Data, setStep1Data] = useState<NewAgentStep1Data | undefined>();
  const [step2Data, setStep2Data] = useState<NewAgentStep2Data | undefined>();
  const [step3Data, setStep3Data] = useState<NewAgentStep3Data | undefined>();
  const [step4Data, setStep4Data] = useState<NewAgentStep4Data | undefined>();
  const [step5Data, setStep5Data] = useState<NewAgentStep5Data | undefined>();
  const [agent, setAgent] = useState<Agent | undefined>();

  if (!step1Data) {
    return (
      <NewAgentStep1Section
        onStep1DataDefine={(step1Data) => setStep1Data(step1Data)}
      />
    );
  }

  if (!step2Data) {
    return (
      <NewAgentStep2Section
        onStep2DataDefine={(step2Data) => setStep2Data(step2Data)}
      />
    );
  }

  if (!step3Data) {
    return (
      <NewAgentStep3Section
        onStep3DataDefine={(step3Data) => setStep3Data(step3Data)}
      />
    );
  }

  if (!step4Data) {
    return (
      <NewAgentStep4Section
        onStep4DataDefine={(step4Data) => setStep4Data(step4Data)}
      />
    );
  }

  if (!step5Data) {
    return (
      <NewAgentStep5Section
        onStep5DataDefine={(step5Data) => setStep5Data(step5Data)}
      />
    );
  }

  if (!agent) {
    return (
      <NewAgentFinalStepSection
        step1Data={step1Data}
        step2Data={step2Data}
        step3Data={step3Data}
        step4Data={step4Data}
        step5Data={step5Data}
        onAgentDefine={(agent) => setAgent(agent)}
      />
    );
  }

  return <NewAgentCreatedSection agent={agent} />;
}
