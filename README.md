# Web traffic

## Overview

This project visualizes unique visitor data by country and hour of the day. It aggregates data based on the selected time period and allows users to choose different date ranges.

## Features

- **Interactive Heatmap**:

  - **Y-axis**: List of countries.
  - **X-axis**: Hours of the day (1-24).
  - **Cells**: Represent the number of unique visitors with colors indicating visitor counts.
  - **Tooltips**: Display detailed information (unique visitors, hour, country) on hover.
  - **Node Animation**: Nodes animate on hover, increasing in size and changing appearance.
  - **Loading Indicator**: Displays a loading spinner while fetching data from the server.

- **Date Range Selector**:

  - Allows users to filter the heatmap data by:
    - Last week
    - Last two weeks
    - Last month
    - Last quarter
    - Last year
  - The heatmap updates dynamically based on the selected date range.

- **Data Fetching and Aggregation**:

  - **Backend**: Uses tRPC to create API endpoints for fetching and aggregating data from ElasticSearch.
  - **ElasticSearch Integration**: Efficiently retrieves and processes unique visitor data based on the selected date range.

## Cloning and running the project

```bash
git clone git@github.com:Liyumk/full-stack-dev-take-home-project.git
cd full-stack-dev-take-home-project
npm i
npm run dev
```
