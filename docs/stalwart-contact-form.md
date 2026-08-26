# Stalwart contact form runbook

This runbook describes configuration that an operator applies on the Stalwart server and reverse
proxy. The website repository contains no Stalwart credentials, administrator token or local
recipient address. The deployed site only needs the public `PUBLIC_CONTACT_FORM_ACTION` build
variable.

The contract is based on Stalwart's current [Form Handling documentation][form-docs], the
[`HttpForm` object reference][http-form-ref] and [reverse-proxy guidance][proxy-docs]. Stalwart
accepts `POST` requests at `/form`, builds a message for configured local recipients and rejects
external recipients so the endpoint cannot become an open relay.

## Website field contract

The native HTML form sends `application/x-www-form-urlencoded` data without client-side JavaScript.
Use this exact mapping in the Stalwart `HttpForm` singleton:

| HTML field | `HttpForm` setting | Purpose |
| --- | --- | --- |
| `name` | `fieldName` | Sender display name |
| `email` | `fieldEmail` | Sender and `From` address |
| `subject` | `fieldSubject` | Message subject |
| `company` | `fieldHoneyPot` | Hidden spam trap; a non-empty value is rejected |
| `message` | none | Included in the generated message body with the other non-empty fields |

Stalwart currently returns a JSON success or error response. A browser submitting this progressive
HTML form therefore navigates to that response; the site does not add JavaScript or depend on CORS.
The current handler implementation, including body construction and response shape, is visible in
Stalwart's [form handler source][form-source].

## Server configuration

In the Stalwart WebUI, open **Settings > Network > HTTP > Contact Form** and configure the
`HttpForm` singleton. Replace every `example.test` address below with an address on a domain that is
local to this Stalwart installation:

```json
{
  "enable": true,
  "maxSize": 10240,
  "validateDomain": true,
  "rateLimit": { "count": 5, "period": 3600000 },
  "deliverTo": { "contact@example.test": true },
  "fieldEmail": "email",
  "defaultFromAddress": "website-form@example.test",
  "fieldHoneyPot": "company",
  "fieldName": "name",
  "defaultName": "Website visitor",
  "fieldSubject": "subject",
  "defaultSubject": "N/L Foundry website contact"
}
```

`deliverTo` must contain at least one existing local recipient or local alias. Confirm local
delivery before exposing the endpoint. `defaultFromAddress` should also be an operator-controlled
address valid for the local mail setup; it is the fallback if the required browser field is absent.
Keep `validateDomain` enabled so Stalwart checks the submitted sender domain. The 10 KiB body limit
comfortably covers the site's field limits while remaining below Stalwart's 100 KiB default.

Save the settings, then run **Management > Actions > Reload settings** so the running core loads the
new server configuration. Stalwart's [configuration guide][configuration-docs] documents the
equivalent CLI action as `stalwart-cli create Action/ReloadSettings`. The same singleton can be
inspected with `stalwart-cli get HttpForm`, but administration credentials and tokens must remain in
the operator's secure environment and must never be copied into this repo.

## Abuse controls

- Keep `fieldHoneyPot` mapped to `company`; do not map it to `subject` or another required field.
- Start with the documented default of five submissions per IP per hour and adjust only from
  observed legitimate traffic. This form-specific limit complements Stalwart's general anonymous
  HTTP request limit.
- Keep domain validation enabled and retain Stalwart's normal spam filtering and observability for
  the local delivery path.
- Turnstile is a possible later defence-in-depth change. It is intentionally not part of this
  integration and would require a separate trusted verifier; a public site key alone is not
  sufficient.

## Reverse proxy

Publish the endpoint only as HTTPS, for example `https://mail.example.test/form`, and proxy the POST
body and `Content-Type` header to Stalwart without rewriting `/form`. A path-prefixed public mount is
also valid when its final path is `/form`, for example `https://example.test/mail/form`, provided the
proxy strips only the public prefix before forwarding.

Preserve the real client address because both the form-specific and anonymous limits are per IP.
For an HTTP-mode proxy, Stalwart documents `Http.useXForwarded`; enable it only when requests can
reach Stalwart exclusively through a trusted proxy that overwrites forwarding headers. For a
TCP-mode proxy, configure Proxy Protocol and trust only the proxy's address or subnet. Do not enable
both mechanisms on one listener. Also apply a proxy request-body limit no larger than the Stalwart
`maxSize` value and allow `POST` and `OPTIONS` on this route.

## Deployment and test procedure

1. Configure `HttpForm` and verify that `deliverTo` resolves to an existing local recipient.
2. Configure the trusted proxy path and client-IP forwarding, then verify the public URL presents a
   valid HTTPS certificate.
3. In GitHub repository **Actions variables**, set
   `PUBLIC_CONTACT_FORM_ACTION=https://<public-stalwart-host>/form`. Optionally set the public
   `PUBLIC_CONTACT_EMAIL` fallback. Do not use Actions secrets for either value; both are emitted in
   the static HTML.
4. Build a preview and inspect the generated contact form action before deployment.
5. Submit from a browser with all visible fields populated and `company` empty. Expect an HTTP 200
   JSON response with `data.success: true`, then confirm one message arrives in the local mailbox
   with the expected name, email, subject and message values.
6. Submit a deliberately invalid sender domain and confirm Stalwart returns an error without local
   delivery.
7. In an isolated test window, submit `company=bot-value` and confirm Stalwart rejects it without
   delivery. Do not run rate-limit exhaustion tests against production traffic; use a controlled
   source IP and restore the chosen limit afterward.
8. Review Stalwart and proxy logs to confirm the recorded source address is the real test client,
   not the reverse proxy.

Never place a real administrator token, proxy credential or private recipient configuration in a
shell history, build variable, issue or pull request.

[form-docs]: https://stalw.art/docs/http/form-submission/
[http-form-ref]: https://stalw.art/docs/ref/object/http-form/
[proxy-docs]: https://stalw.art/docs/server/reverse-proxy/
[configuration-docs]: https://stalw.art/docs/configuration/
[form-source]: https://github.com/stalwartlabs/stalwart/blob/19bcad14452de1e0d1a002567d74fa20a8f4c613/crates/http/src/form/mod.rs
