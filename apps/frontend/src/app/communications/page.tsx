import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";

export default async function CommunicationsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-card">
        <span className="dashboard-eyebrow">Sessão ativa</span>
        <h1>{session.name}, sua área de comunicações está pronta.</h1>
        <p>
          O fluxo de autenticação já está conectado ao backend com cookies
          seguros. A próxima slice pode entrar direto na listagem real de
          comunicações.
        </p>
        <dl className="dashboard-meta">
          <div>
            <dt>Usuário</dt>
            <dd>{session.name}</dd>
          </div>
          <div>
            <dt>E-mail</dt>
            <dd>{session.email}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
