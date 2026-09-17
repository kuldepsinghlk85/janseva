// server/services/templateService.js
// Template Service Layer communicating with templates.js

const { templates, websiteSections } = require('../data/templates');

class TemplateService {
  getTemplates() {
    return templates;
  }

  getActiveTemplate() {
    return templates.find(t => t.active) || templates[0];
  }

  activateTemplate(templateId) {
    const target = templates.find(t => t.id === Number(templateId) || t.key === templateId);
    if (!target) throw new Error("Template not found");

    templates.forEach(t => t.active = false);
    target.active = true;
    return target;
  }

  getSections() {
    return websiteSections;
  }

  updateSections(newSections) {
    if (Array.isArray(newSections)) {
      websiteSections.length = 0;
      websiteSections.push(...newSections);
    }
    return websiteSections;
  }

  toggleSection(sectionId) {
    const sec = websiteSections.find(s => s.id === sectionId);
    if (!sec) throw new Error("Section not found");
    sec.enabled = !sec.enabled;
    return sec;
  }
}

module.exports = new TemplateService();
