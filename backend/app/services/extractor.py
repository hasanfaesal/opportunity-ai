from typing import List
from ..schemas.opportunity import EmailInput, Opportunity


def extract_opportunities(emails: List[EmailInput]) -> List[Opportunity]:
    opportunities = []
    keywords = [
        'scholarship',
        'internship',
        'fellowship',
        'competition',
        'admission',
        'grant',
        'award',
        'deadline',
        'apply',
    ]

    for email in emails:
        text = (email.subject + ' ' + email.body).lower()
        is_opportunity = any(kw in text for kw in keywords)

        opp_type = None
        if is_opportunity:
            if 'scholarship' in text:
                opp_type = 'scholarship'
            elif 'internship' in text:
                opp_type = 'internship'
            elif 'fellowship' in text:
                opp_type = 'fellowship'
            elif 'competition' in text:
                opp_type = 'competition'
            elif 'admission' in text:
                opp_type = 'admission'

        opportunities.append(
            Opportunity(
                is_opportunity=is_opportunity,
                opportunity_type=opp_type,
                deadline=None,
                eligibility=None,
                required_docs=None,
                application_link=None,
                contact_email=None,
                raw_email=f'{email.subject}\n{email.body}',
                confidence=0.85 if is_opportunity else 0.1,
            )
        )

    return opportunities
