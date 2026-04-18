from fastapi import APIRouter

from ...schemas.opportunity import EmailBatch, Opportunity, RankRequest
from ...services.extractor import extract_opportunities
from ...services.ranker import rank_opportunities

router = APIRouter()


@router.post('/extract')
def extract_opps(batch: EmailBatch):
    return extract_opportunities(batch.emails)


@router.post('/rank')
def rank_opps(payload: RankRequest):
    return rank_opportunities(payload.opportunities, payload.profile)


@router.post('/extract-rank')
def extract_and_rank(batch: EmailBatch):
    opps = extract_opportunities(batch.emails)
    return rank_opportunities(opps, batch.profile)
