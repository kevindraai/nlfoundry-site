---
title: Building for real workflows, not idealised ones
description: Why N/L Foundry starts with operational behaviour before choosing features or architecture.
---

Software projects often begin with a list of features. N/L Foundry starts one step earlier: with the behaviour that already exists around the problem.

A workflow is rarely just the sequence shown in a process diagram. It includes interruptions, informal shortcuts, incomplete information, shared devices, exceptional cases and people who only use the system occasionally. Those details are not noise around the product. They are part of the product boundary.

## Start with the awkward cases

ClubPOS is a useful example. A generic retail checkout assumes that a sale is completed immediately and that the customer leaves with a receipt. A club bar may instead keep a personal tab open for an evening, apply a voucher, charge an organisational budget or move the balance to controlled credit when someone goes home.

Treating those behaviours as extensions of a conventional checkout would produce a growing collection of exceptions. Treating them as the normal operating model leads to a different domain design.

ExitLane has a similar origin. A consumer VPN application assumes one person selects a location for one device. A network gateway must instead make routing policy visible, preserve safe behaviour during failure and remain understandable to an operator who should not need to reconstruct shell commands.

## Architecture follows responsibility

Once the real workflow is visible, responsibilities can be assigned deliberately:

- which decisions belong to a user;
- which rules belong to the domain;
- which state must be auditable;
- which failures should block an action;
- which operations must be reproducible;
- which details should remain hidden during normal use.

This is more useful than beginning with a preferred framework or infrastructure pattern. Technology choices still matter, but they should support those responsibilities instead of defining them.

## Preserve the reason behind a rule

Operational requirements can look arbitrary after they have been translated into code. A credit limit, a default payment method or a network kill switch may appear to be a small validation rule. In practice each protects a real administrative or safety boundary.

N/L Foundry records those reasons in tests, architecture notes and reviewable work orders. That makes future changes easier to evaluate: not only whether the code still works, but whether the original responsibility is still protected.

## The practical test

A feature is not complete because it works in isolation. It is complete when it fits the environment in which someone must use, operate and maintain it.

That means asking a simple question throughout design and review:

> What happens when this leaves the clean example and meets the actual day?

The answer usually reveals more about the right product than another page of features.
