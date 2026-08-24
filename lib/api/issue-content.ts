export type IssueContentInput = {
  type: "device-request" | "incorrect-image" | "incorrect-metadata";
  details: string;
  brand?: string;
  model?: string;
  modelNumber?: string;
  imageUrl?: string;
  referenceUrl?: string;
  category?: string;
  deviceId?: string;
  deviceBrand?: string;
  deviceModel?: string;
  currentImage?: string;
};

const optionalValue = (value?: string) => value || "Not provided";

export function buildIssueBody(input: IssueContentInput): string {
  if (input.type === "device-request") {
    return [
      "## Device request",
      "",
      `- **Brand:** ${input.brand}`,
      `- **Model:** ${input.model}`,
      `- **Known model number:** ${optionalValue(input.modelNumber)}`,
      `- **Suggested image:** ${optionalValue(input.imageUrl)}`,
      `- **Reference:** ${optionalValue(input.referenceUrl)}`,
      "",
      "### Details",
      "",
      input.details,
    ].join("\n");
  }

  return [
    `## ${input.type === "incorrect-image" ? "Incorrect image" : "Incorrect metadata"}`,
    "",
    `- **Device:** ${input.deviceBrand} ${input.deviceModel}`,
    `- **Device ID:** ${input.deviceId}`,
    `- **Problem category:** ${optionalValue(input.category)}`,
    `- **Current image:** ${optionalValue(input.currentImage)}`,
    `- **Reference:** ${optionalValue(input.referenceUrl)}`,
    "",
    "### Details",
    "",
    input.details,
  ].join("\n");
}
