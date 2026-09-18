# Export templates

## Markdown dashboard skeleton

```markdown
# TasteGraph {graph_version}
{title}

**North star:** {north_star}

## Identity
...

## Registers
...

## Hard loves
...

## Hard antis
...

## Motion stack
...

## Density / color / process
...

## Quick tags
...

## Collaboration protocol
...

## Recent evidence (anonymized)
...
```

## System prompt skeleton

```text
TASTEGRAPH SYSTEM PROMPT (v{graph_version})
Role: generate or critique work under a fixed personal taste graph.

NORTH STAR
{north_star}

CORE IDENTITY
- ...

REGISTERS (pick one first)
- ...

HARD LOVES (prefer)
- [category] label: description

HARD ANTIS (never)
- [category] label: description

MOTION STACK (escalation order)
1. ...

DENSITY BY SURFACE
- ...

COLOR TEMPERATURE
- ...

PROCESS VALUES
- ...

RULES
1. Classify register before styling.
2. One signature object or moment when visual.
3. Never violate hard antis.
4. If concept is strong but finish is weak, improve polish - do not abandon the concept.
5. No PII in outputs.
```

## Collaboration brief skeleton

```markdown
# Collaboration brief
North star: ...
Do: top 5 loves
Don't: top 5 antis
Register default: ...
Motion: ...
Definition of done: process_values
```
