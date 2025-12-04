import { render } from "@react-email/render";
import { getTransport } from "lib/email";
import type { CodeEmailProps } from "components/_emails/code";
import type { RevealEmailProps } from "components/_emails/reveal";

import CodeEmail from "components/_emails/code";
import RevealEmail from "components/_emails/reveal";
import ConfirmEmail from "components/_emails/confirm";

const FROM = process.env.GMAIL_ADDRESS!; // safe for Gmail API

export async function sendConfirmationEmailToGuest(
  sendTo: string,
  emailProps: RevealEmailProps
) {
  const html = await render(<ConfirmEmail {...emailProps} />, { pretty: true });

  await getTransport().send({
    from: FROM,
    to: sendTo,
    subject: "Vamos confirmar sua participação no evento?",
    html,
  });
}

export async function sendRevealEmailToGuest(
  sendTo: string,
  emailProps: RevealEmailProps
) {
  const html = await render(<RevealEmail {...emailProps} />, { pretty: true });

  await getTransport().send({
    from: FROM,
    to: sendTo,
    subject: "Chegou a hora tão esperada! Vem conferir seu amigo secreto!",
    html,
  });
}

export async function sendAllRevealEmailsToGuests(
  props: RevealEmailProps[]
) {
  const transport = getTransport();

  for (const guest of props) {
    const html = await render(<RevealEmail {...guest} />, { pretty: true });

    await transport.send({
      from: FROM,
      to: guest.guestEmail,
      subject: "Chegou a hora tão esperada! Vem conferir seu amigo secreto!",
      html,
    });
  }
}

export async function sendCodeEmailToUser(
  sendTo: string,
  emailProps: CodeEmailProps
) {
  const html = await render(<CodeEmail {...emailProps} />, { pretty: true });

  await getTransport().send({
    from: FROM,
    to: sendTo,
    subject: "Seu código de verificação para concluir seu cadastro no presenteio",
    html,
  });
}
