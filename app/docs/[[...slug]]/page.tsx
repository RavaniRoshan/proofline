import { source } from "@/lib/source";
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Callout } from "fumadocs-ui/components/callout";
import { Card, Cards } from "fumadocs-ui/components/card";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { DeterministicRoutingBento } from "@/components/landing/bento/DeterministicRoutingBento";
import { RegisterLineageBento } from "@/components/landing/bento/RegisterLineageBento";
import { EvidenceGateInspectorBento } from "@/components/landing/bento/EvidenceGateInspectorBento";
import { ApiPlayground } from "@/components/landing/ApiPlayground";
import { AuditLedgerBento } from "@/components/landing/bento/AuditLedgerBento";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            Callout,
            Card,
            Cards,
            Step,
            Steps,
            Tab,
            Tabs,
            DeterministicRoutingBento,
            RegisterLineageBento,
            EvidenceGateInspectorBento,
            ApiPlayground,
            AuditLedgerBento,
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  return {
    title: `${page.data.title} — Proofline Documentation`,
    description: page.data.description,
  };
}
