from typing import List
from datetime import datetime
from ..schemas.opportunity import Opportunity, StudentProfile, RankedOpportunity


def rank_opportunities(opportunities: List[Opportunity], profile: StudentProfile) -> List[RankedOpportunity]:
    ranked = []

    for opp in opportunities:
        if not opp.is_opportunity:
            continue

        fit_score = _calculate_fit_score(opp, profile)
        urgency_score = _calculate_urgency_score(opp)
        completeness_score = _calculate_completeness_score(opp)

        score = 0.4 * fit_score + 0.4 * urgency_score + 0.2 * completeness_score

        reasoning = _generate_reasoning(opp, profile, fit_score, urgency_score)
        next_steps = _generate_next_steps(opp)

        ranked.append(
            RankedOpportunity(
                opportunity=opp,
                score=score,
                fit_score=fit_score,
                urgency_score=urgency_score,
                completeness_score=completeness_score,
                reasoning=reasoning,
                next_steps=next_steps,
            )
        )

    ranked.sort(key=lambda x: x.score, reverse=True)
    return ranked


def _calculate_fit_score(opp: Opportunity, profile: StudentProfile) -> float:
    if not opp.eligibility:
        return 0.5

    score = 0.0
    for el in opp.eligibility:
        el_lower = el.lower()
        if any(skill.lower() in el_lower for skill in profile.skills):
            score += 0.3
        if any(interest.lower() in el_lower for interest in profile.interests):
            score += 0.3

    return min(1.0, score + 0.2)


def _calculate_urgency_score(opp: Opportunity) -> float:
    if not opp.deadline:
        return 0.3

    try:
        deadline = datetime.strptime(opp.deadline, '%Y-%m-%d')
        days_left = (deadline - datetime.now()).days
        if days_left < 0:
            return 0.0
        elif days_left <= 7:
            return 1.0
        elif days_left <= 30:
            return 0.7
        else:
            return 0.4
    except:
        return 0.3


def _calculate_completeness_score(opp: Opportunity) -> float:
    score = 0.0
    if opp.opportunity_type:
        score += 0.25
    if opp.deadline:
        score += 0.25
    if opp.eligibility:
        score += 0.25
    if opp.application_link or opp.contact_email:
        score += 0.25
    return score


def _generate_reasoning(opp: Opportunity, profile: StudentProfile, fit: float, urgency: float) -> str:
    parts = []
    if fit > 0.7:
        parts.append(f'Strong fit for {profile.major} students')
    elif fit > 0.4:
        parts.append(f'Moderate fit for {profile.major}')
    else:
        parts.append('May require additional qualifications')

    if urgency > 0.7:
        parts.append('urgent deadline approaching')
    elif urgency > 0.4:
        parts.append('reasonable timeframe')

    if opp.opportunity_type:
        parts.append(f'{opp.opportunity_type} opportunity')

    return '. '.join(parts) + '.'


def _generate_next_steps(opp: Opportunity) -> List[str]:
    steps = []
    if opp.application_link:
        steps.append('Visit application link')
    if opp.contact_email:
        steps.append(f'Contact {opp.contact_email}')
    if opp.required_docs:
        steps.append('Prepare required documents')
    if not steps:
        steps.append('Review full details')
    return steps
