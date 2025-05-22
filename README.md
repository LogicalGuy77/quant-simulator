# Quant Sim: Real-Time Algorithmic Trading Low Latency Cost Analysis System

[![Watch the Demo](https://img.shields.io/badge/Watch%20Demo-YouTube-red)](https://youtu.be/X8PhF6XzxIM)
[![Read the Article](https://img.shields.io/badge/Read%20Article-Medium-black)](https://medium.com/@harshitweb3/behind-the-code-real-time-trade-simulation-for-crypto-markets-using-quant-models-ee29f55f0458)

Quant Sim is a high-performance system designed for real-time analysis of execution costs in cryptocurrency trading. It models crucial cost components such as slippage, market impact, and exchange fees, enabling traders to anticipate these expenses *before* placing orders. The system focuses on low-latency calculations and provides real-time visualization through a responsive web interface.

## Overview

Trading Cost Analysis (TCA) is pivotal for optimizing algorithmic trading strategies. Quant Sim provides a practical implementation of TCA by:

1.  Processing real-time order book data from cryptocurrency exchanges.
2.  Calculating execution costs using specialized quantitative finance models.
3.  Presenting results and simulations through an intuitive frontend.

The primary goal is to offer traders a tool to better understand and predict the costs associated with their trading activities in volatile crypto markets.

## Key Features

* **Real-Time Cost Estimation**: Instantly calculates slippage, market impact, and fees.
* **Interactive Simulation**: Allows users to input trade parameters (e.g., order size, volatility) and see projected costs.
* **Live Order Book Visualization**: Displays current market depth.
* **Maker/Taker Proportion Modeling**: Predicts fee structures based on order characteristics.
* **Low Latency Architecture**: Optimized for speed using Numba JIT compilation and efficient data handling.
* **Historical Metrics**: Tracks cost evolution over time.
* **Responsive Web Interface**: Clean and information-dense UI for traders.

## Technical Stack

* **Backend**:
    * Python
    * FastAPI (for REST and WebSocket APIs)
    * Numba (for JIT compilation of performance-critical code)
    * NumPy (for efficient numerical operations)
    * WebSockets (for real-time data communication with exchanges and clients)
* **Frontend**:
    * React (for the user interface)
* **Data**: Real-time order book data from cryptocurrency exchanges.

## Core Models Implemented

Quant Sim leverages several mathematical models to estimate trading costs:

1.  **Almgren-Chriss Market Impact Model**:
    * Estimates both temporary (transient) and permanent (lasting) price impact caused by a trade.
    * Formulation: `I_total = (η × v^α) + (γ × v^β)`
    * Utilizes parameters calibrated for cryptocurrency markets.
2.  **Slippage Estimation Model**:
    * A heuristic model considering spread consumption and market volatility.
    * Formula: `S = max(S_min, S_consumption + S_volatility)`
    * Includes a framework for future ML-based estimation (Linear & Quantile Regression).
3.  **Maker/Taker Proportion Model**:
    * Predicts the proportion of an order likely to execute as a 'maker' (adding liquidity) versus a 'taker' (removing liquidity).
    * Considers order size, market depth, volatility, and spread.

## Performance Optimizations

To achieve low-latency performance, Quant Sim incorporates:

* **Numba JIT Compilation**: Critical numerical functions (e.g., market impact calculations) are compiled to machine code at runtime using `@numba.jit(nopython=True)`.
* **NumPy Array Operations**: Order book data is processed using vectorized NumPy operations for speed.
* **Efficient WebSocket Handling**: Includes robust reconnection strategies, optimized message processing, and selective updates to clients.
* **Data Caching & Historical Data Limiting**: Manages memory efficiently by caching recent data and maintaining a fixed-size window for historical metrics.

## Demonstration & In-Depth Explanation

* **Watch the Video Demo**: See Quant Sim in action and get a walkthrough of its features and architecture.
    * [**YouTube Demo Link**](https://youtu.be/X8PhF6XzxIM)
* **Read the Technical Article**: Dive deeper into the quantitative models, system design, and implementation details.
    * [**Medium Article Link**](https://medium.com/@harshitweb3/behind-the-code-real-time-trade-simulation-for-crypto-markets-using-quant-models-ee29f55f0458)

## Limitations

While providing robust estimations, the current models have certain limitations:

* **Parameter Calibration**: Model parameters (e.g., for Almgren-Chriss, slippage heuristics) are currently predefined and not yet empirically calibrated to specific live market conditions or all assets.
* **Minimum Thresholds**: The models enforce minimum cost values, which might slightly overestimate costs for very small orders in highly liquid markets.
* **Linear Impact Assumptions**: The market impact model primarily uses linear scaling (α = β = 1), which is a simplification, as real markets can exhibit non-linear responses.

Future work aims to address these through adaptive modeling and machine learning enhancements.