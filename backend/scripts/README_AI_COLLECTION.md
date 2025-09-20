# AI-Powered Influencer Data Collection

This system automatically collects and analyzes B2B influencers from LinkedIn, newsletters, and podcasts using AI to extract audience insights and buyer alignment scores.

## Features

- **Multi-Platform Collection**: LinkedIn, newsletters, and podcasts
- **AI Analysis**: Automatic industry categorization and expertise extraction
- **Audience Demographics**: AI-powered audience breakdown and buyer alignment scoring
- **Intent-Led Discovery**: Identify influencers your buyers already follow
- **Quality Control**: Automated data validation and confidence scoring

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r ai_requirements.txt
   ```

2. **Set Environment Variables**:
   ```bash
   export OPENAI_API_KEY="your_openai_key"
   export LINKEDIN_API_KEY="your_linkedin_key"  # Optional
   export SUBSTACK_API_KEY="your_substack_key"  # Optional
   ```

3. **Configure Search Terms**:
   Edit `ai_config.py` to customize search terms and collection limits.

## Usage

### Basic Collection
```bash
python ai_data_collection.py
```

### Custom Search Terms
```python
from ai_data_collection import AIDataCollector

async def collect_custom():
    async with AIDataCollector() as collector:
        influencers = await collector.run_collection(
            search_terms=['saas', 'b2b', 'marketing'],
            save_to_db=True
        )
```

## AI Analysis Features

### Industry Categorization
- Automatically categorizes influencers by industry (SaaS, Marketing, Sales, etc.)
- Uses keyword analysis and AI to determine primary industry focus

### Expertise Extraction
- Extracts relevant expertise tags from bio and content
- Identifies key skills and specializations

### Audience Demographics
- Analyzes audience composition and job titles
- Calculates buyer alignment scores (0-100)
- Estimates audience seniority and company size

### Intent-Led Discovery
- Shows which influencers your target buyers follow
- Provides trust indicators and engagement patterns
- Enables buyer persona matching

## Data Quality

The system includes several quality control measures:

- **Confidence Scoring**: AI confidence in analysis (0-1)
- **Data Validation**: Required fields and minimum thresholds
- **Duplicate Detection**: Prevents duplicate influencer entries
- **Manual Review**: Flagged influencers for manual verification

## Configuration

### Search Terms
Customize search terms for each platform in `ai_config.py`:

```python
SEARCH_TERMS = {
    'linkedin': ['saas', 'b2b', 'marketing', 'growth'],
    'newsletter': ['saas newsletter', 'b2b marketing'],
    'podcast': ['saas podcast', 'b2b marketing']
}
```

### Collection Limits
Set limits for each platform:

```python
COLLECTION_LIMITS = {
    'linkedin': 100,
    'newsletter': 50,
    'podcast': 30
}
```

### AI Analysis
Configure AI analysis parameters:

```python
AI_CONFIG = {
    'confidence_threshold': 0.7,
    'max_retries': 3,
    'timeout_seconds': 30
}
```

## Output

The system generates influencer records with:

- **Basic Info**: Name, platform, bio, contact details
- **Audience Data**: Size, engagement rate, demographics
- **AI Analysis**: Industry, expertise tags, buyer alignment
- **Quality Metrics**: Confidence scores, verification status

## Future Enhancements

- **Real-time Collection**: Continuous monitoring and updates
- **Advanced AI**: GPT-4 integration for better analysis
- **Social Proof**: Follower verification and engagement validation
- **Competitive Analysis**: Track influencer performance over time
- **API Integrations**: Direct platform API connections

## Troubleshooting

### Common Issues

1. **Rate Limiting**: Adjust `RATE_LIMITS` in config
2. **API Errors**: Check API keys and quotas
3. **Data Quality**: Review `QUALITY_THRESHOLDS`
4. **Memory Issues**: Reduce `batch_size` in config

### Debug Mode

Enable detailed logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Security & Compliance

- **Data Privacy**: Only collects publicly available information
- **Rate Limiting**: Respects platform rate limits
- **API Keys**: Secure storage and rotation
- **GDPR Compliance**: Minimal data collection approach
