/**
 * PRODUCTION-GRADE VARIABLE INJECTOR
 * Swaps {{key}} placeholders with project/client data.
 */
export const injectVariables = (template: string, data: any) => {
  const variables = {
    clientName: data.clientName || "Client",
    projectTitle: data.title || "your project",
    serviceType: data.serviceType || "development",
    totalPrice: data.totalPrice || "0.00",
    ...data,
  };

  return template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
    return variables[key.trim()] || match;
  });
};
