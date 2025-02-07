"use client";

import { Agent } from "@/mongodb/models/agent";
import { NewAgentRequestData } from "@/types/new-agent-request-data";
import { useState } from "react";
import { NewAgentCreatedSection } from "./new-agent-created-section";
import { NewAgentStep1Section } from "./new-agent-step-1-section";
import { NewAgentStep2Section } from "./new-agent-step-2-section";
import { NewAgentStep3Section } from "./new-agent-step-3-section";
import { NewAgentStep4Section } from "./new-agent-step-4-section";
import { NewAgentStep5Section } from "./new-agent-step-5-section";
import { NewAgentFinalStepSection } from "./new-agent-step-final-section";

export function NewAgentSection() {
  const [newAgenRequesttData, setNewAgentRequestData] =
    useState<NewAgentRequestData>({});
  const [newAgent, setNewAgent] = useState<Agent | undefined>();

  if (!newAgenRequesttData.user) {
    return (
      <NewAgentStep1Section
        newAgentRequestData={newAgenRequesttData}
        onNewAgentRequestDataUpdate={(newAgentRequestData) =>
          setNewAgentRequestData(newAgentRequestData)
        }
      />
    );
  }

  if (!newAgenRequesttData.personality) {
    return (
      <NewAgentStep2Section
        newAgentRequestData={newAgenRequesttData}
        onNewAgentRequestDataUpdate={(newAgentRequestData) =>
          setNewAgentRequestData(newAgentRequestData)
        }
      />
    );
  }

  if (!newAgenRequesttData.chain) {
    return (
      <NewAgentStep3Section
        newAgentRequestData={newAgenRequesttData}
        onNewAgentRequestDataUpdate={(newAgentRequestData) =>
          setNewAgentRequestData(newAgentRequestData)
        }
      />
    );
  }

  if (!newAgenRequesttData.addressBook) {
    return (
      <NewAgentStep4Section
        newAgentRequestData={newAgenRequesttData}
        onNewAgentRequestDataUpdate={(newAgentRequestData) =>
          setNewAgentRequestData(newAgentRequestData)
        }
      />
    );
  }

  if (!newAgenRequesttData.twitter) {
    return (
      <NewAgentStep5Section
        newAgentRequestData={newAgenRequesttData}
        onNewAgentRequestDataUpdate={(newAgentRequestData) =>
          setNewAgentRequestData(newAgentRequestData)
        }
      />
    );
  }

  if (!newAgent) {
    return (
      <NewAgentFinalStepSection
        newAgentRequestData={newAgenRequesttData}
        onAgentDefine={(agent) => setNewAgent(agent)}
      />
    );
  }

  return <NewAgentCreatedSection newAgent={newAgent} />;
}
