import React from 'react';
import { Card, Text, Divider, Link } from '@fluentui/react-components';
import '@/styles/AboutPage.css';

export const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <Card className="about-card">
        <Text as="h1" size={700} weight="bold" className="about-title">
          UCMP Segmentation Agent
        </Text>

        <Divider className="about-divider" />

        <section className="about-section">
          <Text as="h2" size={500} weight="semibold">
            About
          </Text>
          <br />
          <Text>
            The UCMP Segmentation Agent is an AI-powered assistant that helps you create, refine, and activate
            audience segments with ease. Built with Azure AI Foundry, this custom portal provides the flexibility
            and control needed for enterprise segmentation workflows—including segment preview, validation,
            and direct file downloads.
          </Text>
        </section>

        <section className="about-section">
          <Text as="h2" size={500} weight="semibold">
            Features
          </Text>
          <ul className="feature-list">
            <li>
              <Text weight="semibold">SQL Generation:</Text> Generate SQL queries from natural language
            </li>
            <li>
              <Text weight="semibold">Preview and Validate:</Text> Preview and validate segment results before activation
            </li>
            <li>
              <Text weight="semibold">Download Results:</Text> Download segment results in CSV format for deeper analysis or downstream activation
            </li>
            <li>
              <Text weight="semibold">Define Segments:</Text> Define segments using attributes and contextual signals <em>(In-progress)</em>
            </li>
            <li>
              <Text weight="semibold">Multi-session Support:</Text> Each browser tab maintains its own conversation
            </li>
          </ul>
        </section>

        <section className="about-section">
          <Text as="h2" size={500} weight="semibold">
            Technology Stack
          </Text>
          <ul className="tech-list">
            <li>React 18 with TypeScript</li>
            <li>Fluent UI v9</li>
            <li>Azure AI Foundry Agents</li>
            <li>ASP.NET Core 8 Web API</li>
          </ul>
        </section>

        <Divider className="about-divider" />

        <section className="about-section">
          <Text as="h2" size={500} weight="semibold">
            Help Resources
          </Text>

          <ul className="help-list">
            <li>
              <Link
                href="https://portal.microsofticm.com/imp/v3/incidents/create?tmpl=V2u2e3"
                target="_blank"
                rel="noopener noreferrer"
              >
                ICM – Create Incident
              </Link>
            </li>
            <li>
              <Link
                href="https://microsoft.sharepoint.com/:w:/t/UnifiedProfileServicesEngineeringTeam/IQCTSknDV3ojR67E2YRzQU6XAW3y7kdVz2lVC_58HjxVmn4?e=GmMhCB&isSPOFile=1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </Link>
            </li>
          </ul>
        </section>

        <Divider className="about-divider" />

        <footer className="about-footer">
          <Link
            href="https://www.microsoft.com/en-us/privacy/privacystatement"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Statement
          </Link>

          <Text size={200} className="about-footer-text">
            © {new Date().getFullYear()} UCMP Segmentation Team. All rights reserved.
          </Text>
        </footer>
      </Card>
    </div>
  );
};
