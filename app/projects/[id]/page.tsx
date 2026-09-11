import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ProjectDetailClient from './ProjectDetailClient';
import { PROJECTS, projectById } from '@/data/projects';

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({ id: project.id.toString() }));
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projectById(Number.parseInt(id, 10));

  if (!project) {
    return (
      <div className="min-h-screen">
        <Header />
        <main id="main" className="rn-page">
          <div className="max-w-6xl mx-auto px-6">
            <div className="rn-detail">
              <h1>We don&rsquo;t have a project at that address</h1>
              <p className="rn-detail-lede">
                The link may be out of date. Every project is listed on the
                projects page.
              </p>
              <p className="rn-work-foot">
                <Link href="/projects">All projects</Link>
                <Link href="/publications">All publications</Link>
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main id="main" className="rn-page">
        <ProjectDetailClient project={project} />
      </main>
      <Footer />
    </div>
  );
}
