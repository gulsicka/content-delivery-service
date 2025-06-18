require('dotenv').config();
const express = require('express');
const useragent = require('express-useragent');
const cookieParser = require('cookie-parser');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const app = express();
const port = 3000;

// Middleware
app.use(useragent.express());
app.use(cookieParser());
app.use(express.static('public'));

// Store request patterns for behavior analysis
const requestPatterns = new Map();

// Social Media Crawlers with latest patterns
const socialMediaPatterns = [
    // Facebook
    /facebookexternalhit/i,
    /facebookcatalog/i,
    /facebook/i,
    /FBAN/i,
    /FBAV/i,
    /FB_IAB/i,
    /FB4A/i,
    /FBIOS/i,
    /FBSS/i,
    /FBSV/i,
    
    // Twitter
    /twitterbot/i,
    /Twitter/i,
    /TwitterCrawler/i,
    /TwitterFeed/i,
    
    // TikTok
    /tiktok/i,
    /TikTokBot/i,
    /TikTokCrawler/i,
    /TikTokShare/i,
    /TikTokApp/i,
    
    // Instagram
    /instagram/i,
    /InstagramBot/i,
    /InstagramCrawler/i,
    /InstagramApp/i,
    
    // LinkedIn
    /linkedinbot/i,
    /LinkedIn/i,
    /LinkedInBot/i,
    /LinkedInCrawler/i,
    
    // Pinterest
    /pinterest/i,
    /PinterestBot/i,
    /PinterestCrawler/i,
    /PinterestApp/i,
    
    // WhatsApp
    /whatsapp/i,
    /WhatsAppBot/i,
    /WhatsAppCrawler/i,
    /WhatsAppApp/i,
    
    // Telegram
    /telegrambot/i,
    /Telegram/i,
    /TelegramBot/i,
    /TelegramCrawler/i,
    
    // Discord
    /discord/i,
    /DiscordBot/i,
    /DiscordCrawler/i,
    /DiscordApp/i,
    
    // Reddit
    /redditbot/i,
    /Reddit/i,
    /RedditBot/i,
    /RedditCrawler/i,
    
    // Snapchat
    /snapchat/i,
    /SnapchatBot/i,
    /SnapchatCrawler/i,
    /SnapchatApp/i,
    
    // Tumblr
    /tumblr/i,
    /TumblrBot/i,
    /TumblrCrawler/i,
    /TumblrApp/i,
    
    // Other Social Media
    /line/i,
    /LineBot/i,
    /LineCrawler/i,
    /LineApp/i,
    /wechat/i,
    /WeChatBot/i,
    /WeChatCrawler/i,
    /WeChatApp/i,
    /kakao/i,
    /KakaoBot/i,
    /KakaoCrawler/i,
    /KakaoApp/i
];

// Common Bot Patterns with latest additions
const botPatterns = [
    // General Bots
    /bot/i,
    /crawler/i,
    /spider/i,
    /crawl/i,
    /scraper/i,
    /scrape/i,
    /parser/i,
    /parse/i,
    
    // HTTP Clients
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /requests/i,
    /axios/i,
    /fetch/i,
    /http/i,
    /https/i,
    
    // Automation Tools
    /playwright/i,
    /cypress/i,
    /nightmare/i,
    /cheerio/i,
    /scrapy/i,
    /beautifulsoup/i,
    /mechanize/i,
    /httrack/i,
    /archive/i,
    /wayback/i,
    /validator/i,
    /checker/i,
    /monitor/i,
    /analyzer/i,
    /scanner/i,
    /selenium/i,
    /puppeteer/i,
    /phantomjs/i,
    /headless/i,
    
    // Security Tools
    /security/i,
    /scan/i,
    /audit/i,
    /check/i,
    /verify/i,
    /validate/i,
    /test/i,
    /debug/i,
    
    // Analytics
    /analytics/i,
    /track/i,
    /monitor/i,
    /stats/i,
    /statistics/i,
    /metric/i,
    /measure/i
];

// ML-based bot detection features
const mlFeatures = {
    // Request patterns
    requestTiming: [],
    requestSequence: [],
    requestFrequency: new Map(),
    
    // Behavioral patterns
    mouseMovements: [],
    keyboardPatterns: [],
    scrollPatterns: [],
    clickPatterns: [],
    
    // Session patterns
    sessionDuration: [],
    pageInteractions: [],
    resourceLoading: [],
    
    // Network patterns
    requestHeaders: new Map(),
    responseTimes: [],
    errorRates: []
};

// ML model parameters
const mlModel = {
    weights: {
        timingScore: 0.2,
        behaviorScore: 0.3,
        sessionScore: 0.2,
        networkScore: 0.3
    },
    thresholds: {
        botProbability: 0.7,
        anomalyThreshold: 0.8
    }
};

// Statistical bot detection
function statisticalDetectBot(req, pattern) {
    // Feature weights (tuned based on importance)
    const weights = {
        requestRate: 0.2,          // Rate of requests
        userAgentVariety: 0.15,    // Number of different user agents
        pathVariety: 0.15,         // Number of different paths
        headerConsistency: 0.2,    // Header consistency
        browserFeatures: 0.15,     // Browser feature completeness
        behaviorScore: 0.15        // Behavioral patterns
    };
    
    // Calculate request rate score (0-1)
    const requestRate = pattern.timing.length / 3600; // requests per hour
    const requestRateScore = Math.min(requestRate / 100, 1);
    
    // Calculate user agent variety score (0-1)
    const userAgentVarietyScore = Math.min(pattern.userAgents.size / 3, 1);
    
    // Calculate path variety score (0-1)
    const pathVarietyScore = Math.min(pattern.paths.size / 10, 1);
    
    // Calculate header consistency score (0-1)
    const requiredHeaders = [
        'accept-language',
        'accept-encoding',
        'cache-control',
        'sec-fetch-dest',
        'sec-fetch-mode',
        'sec-fetch-site',
        'sec-fetch-user'
    ];
    const headerConsistencyScore = requiredHeaders.filter(header => req.headers[header]).length / requiredHeaders.length;
    
    // Calculate browser features score (0-1)
    const browserFeatures = [
        'sec-ch-viewport-width',
        'sec-ch-viewport-height',
        'sec-ch-device-memory',
        'sec-ch-hardware-concurrency',
        'sec-ch-ua-platform',
        'sec-ch-ua-mobile',
        'sec-ch-ua-model'
    ];
    const browserFeaturesScore = browserFeatures.filter(feature => req.headers[feature]).length / browserFeatures.length;
    
    // Calculate behavior score (0-1)
    const behaviorScore = (
        (req.cookies.jsEnabled === 'true' ? 0.5 : 0) +
        (pattern.timing.length > 100 ? 0.5 : 0) +
        (pattern.userAgents.size > 3 ? 0.5 : 0) +
        (pattern.paths.size > 10 ? 0.5 : 0) +
        (pattern.headers.size > 5 ? 0.5 : 0)
    ) / 2.5;
    
    // Calculate weighted score
    const weightedScore = 
        requestRateScore * weights.requestRate +
        userAgentVarietyScore * weights.userAgentVariety +
        pathVarietyScore * weights.pathVariety +
        headerConsistencyScore * weights.headerConsistency +
        browserFeaturesScore * weights.browserFeatures +
        behaviorScore * weights.behaviorScore;
    
    // Debug logs
    console.log('Statistical Detection Scores:');
    console.log('Request Rate Score:', requestRateScore);
    console.log('User Agent Variety Score:', userAgentVarietyScore);
    console.log('Path Variety Score:', pathVarietyScore);
    console.log('Header Consistency Score:', headerConsistencyScore);
    console.log('Browser Features Score:', browserFeaturesScore);
    console.log('Behavior Score:', behaviorScore);
    console.log('Weighted Score:', weightedScore);
    
    // Return true if weighted score is above threshold
    return weightedScore > 0.7;
}

// ML-based bot detection function
function mlDetectBot(req, pattern) {
    // 1. Timing Analysis
    const timingScore = analyzeTimingPattern(pattern.timing);
    
    // 2. Behavioral Analysis
    const behaviorScore = analyzeBehaviorPattern(req);
    
    // 3. Session Analysis
    const sessionScore = analyzeSessionPattern(req, pattern);
    
    // 4. Network Analysis
    const networkScore = analyzeNetworkPattern(req);
    
    // Calculate weighted probability
    const botProbability = 
        timingScore * mlModel.weights.timingScore +
        behaviorScore * mlModel.weights.behaviorScore +
        sessionScore * mlModel.weights.sessionScore +
        networkScore * mlModel.weights.networkScore;
    
    // Debug logs
    console.log('ML Detection Scores:');
    console.log('Timing Score:', timingScore);
    console.log('Behavior Score:', behaviorScore);
    console.log('Session Score:', sessionScore);
    console.log('Network Score:', networkScore);
    console.log('Bot Probability:', botProbability);
    
    return botProbability > mlModel.thresholds.botProbability;
}

// Timing pattern analysis
function analyzeTimingPattern(timing) {
    if (timing.length < 2) return 0;
    
    const intervals = [];
    for (let i = 1; i < timing.length; i++) {
        intervals.push(timing[i] - timing[i-1]);
    }
    
    // Calculate statistical measures
    const mean = intervals.reduce((a, b) => a + b) / intervals.length;
    const variance = intervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);
    
    // Check for suspicious patterns
    const isTooRegular = stdDev < 50; // Too consistent timing
    const isTooFast = mean < 100; // Too quick between requests
    const hasAnomalies = intervals.some(i => i < 10 || i > 10000); // Suspicious intervals
    
    return (isTooRegular || isTooFast || hasAnomalies) ? 1 : 0;
}

// Behavior pattern analysis
function analyzeBehaviorPattern(req) {
    let behaviorScore = 0;
    
    // Check mouse movement patterns
    if (req.headers['x-mouse-movements']) {
        const movements = JSON.parse(req.headers['x-mouse-movements']);
        if (isSuspiciousMousePattern(movements)) behaviorScore += 0.3;
    }
    
    // Check keyboard patterns
    if (req.headers['x-keyboard-patterns']) {
        const patterns = JSON.parse(req.headers['x-keyboard-patterns']);
        if (isSuspiciousKeyboardPattern(patterns)) behaviorScore += 0.3;
    }
    
    // Check scroll patterns
    if (req.headers['x-scroll-patterns']) {
        const patterns = JSON.parse(req.headers['x-scroll-patterns']);
        if (isSuspiciousScrollPattern(patterns)) behaviorScore += 0.4;
    }
    
    return behaviorScore;
}

// Session pattern analysis
function analyzeSessionPattern(req, pattern) {
    let sessionScore = 0;
    
    // Check session duration
    const sessionDuration = Date.now() - pattern.firstSeen;
    if (sessionDuration < 1000) sessionScore += 0.3; // Too short session
    
    // Check page interactions
    if (pattern.paths.size > 10) sessionScore += 0.3; // Too many different paths
    
    // Check resource loading
    if (req.headers['x-resource-loading']) {
        const loading = JSON.parse(req.headers['x-resource-loading']);
        if (isSuspiciousResourceLoading(loading)) sessionScore += 0.4;
    }
    
    return sessionScore;
}

// Network pattern analysis
function analyzeNetworkPattern(req) {
    let networkScore = 0;
    
    // Check request headers
    const headerScore = analyzeHeaders(req.headers);
    networkScore += headerScore * 0.4;
    
    // Check response times
    if (req.headers['x-response-time']) {
        const responseTime = parseInt(req.headers['x-response-time']);
        if (responseTime < 50) networkScore += 0.3; // Suspiciously fast response
    }
    
    // Check error rates
    if (req.headers['x-error-rate']) {
        const errorRate = parseFloat(req.headers['x-error-rate']);
        if (errorRate > 0.1) networkScore += 0.3; // High error rate
    }
    
    return networkScore;
}

// Helper functions for pattern analysis
function isSuspiciousMousePattern(movements) {
    // Check for linear or grid-like patterns
    const linearity = calculateLinearity(movements);
    const gridness = calculateGridness(movements);
    return linearity > 0.8 || gridness > 0.8;
}

function isSuspiciousKeyboardPattern(patterns) {
    // Check for too-perfect typing or too-fast input
    const typingSpeed = calculateTypingSpeed(patterns);
    const errorRate = calculateErrorRate(patterns);
    return typingSpeed > 1000 || errorRate < 0.01;
}

function isSuspiciousScrollPattern(patterns) {
    // Check for mechanical scrolling
    const scrollSpeed = calculateScrollSpeed(patterns);
    const scrollRegularity = calculateScrollRegularity(patterns);
    return scrollSpeed > 1000 || scrollRegularity > 0.9;
}

function isSuspiciousResourceLoading(loading) {
    // Check for unusual resource loading patterns
    const loadOrder = calculateLoadOrder(loading);
    const loadTiming = calculateLoadTiming(loading);
    return loadOrder > 0.9 || loadTiming > 0.9;
}

function analyzeHeaders(headers) {
    let score = 0;
    
    // Check for missing common headers
    const requiredHeaders = [
        'accept-language',
        'accept-encoding',
        'cache-control',
        'connection',
        'host',
        'upgrade-insecure-requests'
    ];
    
    requiredHeaders.forEach(header => {
        if (!headers[header]) score += 0.1;
    });
    
    // Check for suspicious header combinations
    if (headers['user-agent'] && !headers['accept-language']) score += 0.2;
    if (headers['user-agent'] && !headers['accept-encoding']) score += 0.2;
    
    return Math.min(score, 1);
}

// Bot detection function
function isBot(req) {
    const ua = req.useragent;

    const isSocialMediaBot = socialMediaPatterns.some(pattern => pattern.test(ua.source));
    const isRegularBot = botPatterns.some(pattern => pattern.test(ua.source));
    
    // Remove or reduce other checks
    return isSocialMediaBot || isRegularBot;
    // const ip = req.ip;
    // const now = Date.now();
    
    // // Debug logs
    // console.log('User Agent:', ua.source);
    // console.log('Cookies:', req.cookies);
    // console.log('Headers:', req.headers);
    // console.log('IP:', ip);
    
    // // Rate limiting and pattern detection
    // if (!requestPatterns.has(ip)) {
    //     requestPatterns.set(ip, {
    //         count: 0,
    //         firstSeen: now,
    //         lastSeen: now,
    //         userAgents: new Set(),
    //         paths: new Set(),
    //         headers: new Set(),
    //         timing: []
    //     });
    // }
    
    // const pattern = requestPatterns.get(ip);
    // pattern.count++;
    // pattern.lastSeen = now;
    // pattern.userAgents.add(ua.source);
    // pattern.paths.add(req.path);
    // pattern.headers.add(JSON.stringify(req.headers));
    // pattern.timing.push(now);
    
    // // Clean up old patterns (older than 1 hour)
    // const oneHourAgo = now - 3600000;
    // pattern.timing = pattern.timing.filter(time => time > oneHourAgo);
    
    // // Check for suspicious patterns
    // const isSuspiciousPattern = 
    //     // Too many requests in a short time
    //     pattern.timing.length > 100 ||
    //     // Too many different user agents
    //     pattern.userAgents.size > 3 ||
    //     // Too many different paths
    //     pattern.paths.size > 10 ||
    //     // Too many different headers
    //     pattern.headers.size > 5;
    
    // // Browser fingerprinting
    // const fingerprint = {
    //     // Screen properties
    //     screenWidth: req.headers['sec-ch-viewport-width'],
    //     screenHeight: req.headers['sec-ch-viewport-height'],
    //     colorDepth: req.headers['sec-ch-color-depth'],
    //     pixelRatio: req.headers['sec-ch-device-pixel-ratio'],
        
    //     // Browser capabilities
    //     hasTouch: req.headers['sec-ch-touch-enabled'],
    //     hasPointer: req.headers['sec-ch-pointer-enabled'],
    //     hasHover: req.headers['sec-ch-hover-enabled'],
        
    //     // Hardware
    //     deviceMemory: req.headers['sec-ch-device-memory'],
    //     hardwareConcurrency: req.headers['sec-ch-hardware-concurrency'],
        
    //     // Network
    //     connectionType: req.headers['sec-ch-connection-type'],
    //     downlink: req.headers['sec-ch-downlink'],
    //     rtt: req.headers['sec-ch-rtt'],
    //     ect: req.headers['sec-ch-ect'],
        
    //     // Platform
    //     platform: req.headers['sec-ch-ua-platform'],
    //     platformVersion: req.headers['sec-ch-ua-platform-version'],
    //     mobile: req.headers['sec-ch-ua-mobile'],
    //     model: req.headers['sec-ch-ua-model'],
    //     architecture: req.headers['sec-ch-ua-arch'],
    //     bitness: req.headers['sec-ch-ua-bitness'],
    //     wow64: req.headers['sec-ch-ua-wow64']
    // };
    
    // // Check for missing or suspicious fingerprint values
    // const hasSuspiciousFingerprint = 
    //     !fingerprint.screenWidth ||
    //     !fingerprint.screenHeight ||
    //     !fingerprint.colorDepth ||
    //     !fingerprint.pixelRatio ||
    //     !fingerprint.hasTouch ||
    //     !fingerprint.hasPointer ||
    //     !fingerprint.hasHover ||
    //     !fingerprint.deviceMemory ||
    //     !fingerprint.hardwareConcurrency ||
    //     !fingerprint.connectionType ||
    //     !fingerprint.downlink ||
    //     !fingerprint.rtt ||
    //     !fingerprint.ect ||
    //     !fingerprint.platform ||
    //     !fingerprint.platformVersion ||
    //     !fingerprint.mobile ||
    //     !fingerprint.model ||
    //     !fingerprint.architecture ||
    //     !fingerprint.bitness;
    
    // // Check for browser inconsistencies
    // const hasBrowserInconsistencies = 
    //     // Check if mobile flag matches viewport
    //     (fingerprint.mobile === '?1' && parseInt(fingerprint.screenWidth) > 1024) ||
    //     // Check if device memory is reasonable
    //     (fingerprint.deviceMemory && (parseFloat(fingerprint.deviceMemory) < 0.5 || parseFloat(fingerprint.deviceMemory) > 32)) ||
    //     // Check if hardware concurrency is reasonable
    //     (fingerprint.hardwareConcurrency && (parseInt(fingerprint.hardwareConcurrency) < 1 || parseInt(fingerprint.hardwareConcurrency) > 32)) ||
    //     // Check if screen dimensions are reasonable
    //     (fingerprint.screenWidth && (parseInt(fingerprint.screenWidth) < 100 || parseInt(fingerprint.screenWidth) > 7680)) ||
    //     (fingerprint.screenHeight && (parseInt(fingerprint.screenHeight) < 100 || parseInt(fingerprint.screenHeight) > 4320));
    
    // // Check for automation indicators
    // const hasAutomationIndicators = 
    //     req.headers['x-automation-tool'] ||
    //     req.headers['x-selenium-version'] ||
    //     req.headers['x-playwright-version'] ||
    //     req.headers['x-cypress-version'] ||
    //     req.headers['x-puppeteer-version'] ||
    //     req.headers['x-nightmare-version'] ||
    //     req.headers['x-phantomjs-version'] ||
    //     req.headers['x-headless-version'] ||
    //     req.headers['x-browserless-version'] ||
    //     req.headers['x-webdriver-version'] ||
    //     req.headers['x-selenium-ide-version'] ||
    //     req.headers['x-selenium-rc-version'] ||
    //     req.headers['x-selenium-grid-version'] ||
    //     req.headers['x-selenium-standalone-version'] ||
    //     req.headers['x-selenium-server-version'] ||
    //     req.headers['x-selenium-node-version'] ||
    //     req.headers['x-selenium-hub-version'] ||
    //     req.headers['x-selenium-remote-version'] ||
    //     req.headers['x-selenium-remote-webdriver-version'] ||
    //     req.headers['x-selenium-remote-webdriver-standalone-version'] ||
    //     req.headers['x-selenium-remote-webdriver-server-version'] ||
    //     req.headers['x-selenium-remote-webdriver-node-version'] ||
    //     req.headers['x-selenium-remote-webdriver-hub-version'];
    
    // // Check for bot-like behavior
    // const hasBotBehavior = 
    //     // Missing common headers
    //     !req.headers['accept-language'] ||
    //     !req.headers['accept-encoding'] ||
    //     !req.headers['cache-control'] ||
    //     !req.headers['connection'] ||
    //     !req.headers['host'] ||
    //     !req.headers['upgrade-insecure-requests'] ||
        
    //     // Missing security headers
    //     !req.headers['sec-fetch-dest'] ||
    //     !req.headers['sec-fetch-mode'] ||
    //     !req.headers['sec-fetch-site'] ||
    //     !req.headers['sec-fetch-user'] ||
        
    //     // Missing browser features
    //     !req.headers['dnt'] ||
    //     !req.headers['viewport-width'] ||
    //     !req.headers['device-memory'] ||
    //     !req.headers['rtt'] ||
    //     !req.headers['downlink'] ||
    //     !req.headers['ect'] ||
        
    //     // Missing UI preferences
    //     !req.headers['sec-ch-prefers-color-scheme'] ||
    //     !req.headers['sec-ch-prefers-reduced-motion'] ||
    //     !req.headers['sec-ch-prefers-reduced-transparency'] ||
    //     !req.headers['sec-ch-prefers-contrast'] ||
    //     !req.headers['sec-ch-prefers-reduced-data'] ||
    //     !req.headers['sec-ch-prefers-reduced-layout-shift'] ||
    //     !req.headers['sec-ch-prefers-reduced-animation'] ||
    //     !req.headers['sec-ch-prefers-reduced-transition'];
    
    // // Check for JavaScript support
    // const hasJS = req.cookies.jsEnabled === 'true';
    
    // // Check for social media crawlers
    // const isSocialMediaBot = socialMediaPatterns.some(pattern => pattern.test(ua.source));
    
    // // Check for common bots
    // const isRegularBot = botPatterns.some(pattern => pattern.test(ua.source));
    
    // // Statistical detection
    // const isStatisticalBot = statisticalDetectBot(req, pattern);
    
    // // Add ML-based detection
    // const isMLBot = mlDetectBot(req, pattern);
    
    // // Debug logs
    // console.log('Is Suspicious Pattern:', isSuspiciousPattern);
    // console.log('Has Suspicious Fingerprint:', hasSuspiciousFingerprint);
    // console.log('Has Browser Inconsistencies:', hasBrowserInconsistencies);
    // console.log('Has Automation Indicators:', hasAutomationIndicators);
    // console.log('Has Bot Behavior:', hasBotBehavior);
    // console.log('Has JS:', hasJS);
    // console.log('Is Social Media Bot:', isSocialMediaBot);
    // console.log('Is Regular Bot:', isRegularBot);
    // console.log('Is Statistical Bot:', isStatisticalBot);
    // console.log('Is ML Bot:', isMLBot);
    
    // // Return true if any bot indicators are present, including ML detection
    // return isSuspiciousPattern ||
    //        hasSuspiciousFingerprint ||
    //        hasBrowserInconsistencies ||
    //        hasAutomationIndicators ||
    //        hasBotBehavior ||
    //        !hasJS ||
    //        isSocialMediaBot ||
    //        isRegularBot ||
    //        isStatisticalBot ||
    //        isMLBot;
}

// Main route
app.get('/', (req, res) => {
    const isBot1 = isBot(req);
    console.log('Is Bot:', isBot1);
    // if (isBot1) {
    //     console.log('Serving bot content');
    //     // Serve harmless content to bots
    //     const blogContent = `
    //     <!DOCTYPE html>
    //     <html lang="en">
    //     <head>
    //         <meta charset="UTF-8">
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //         <title>Pawsome Playhouse - Your Ultimate Guide to Dog Playhouses</title>
    //         <meta name="description" content="Discover the best dog playhouses, DIY guides, and expert tips for creating the perfect play space for your furry friend. From luxury designs to budget-friendly options.">
    //         <meta name="author" content="Dr. Sarah Johnson, Canine Behavior Specialist">
    //         <meta property="og:title" content="Pawsome Playhouse - Expert Guide to Dog Playhouses">
    //         <meta property="og:description" content="Your comprehensive resource for dog playhouses, featuring expert advice, DIY guides, and the latest trends in canine architecture.">
    //         <meta property="og:type" content="article">
    //         <meta property="og:url" content="https://pawsomeplayhouse.com">
    //         <meta property="og:image" content="https://images.unsplash.com/photo-1548199973-03cce0bbc87b">
    //         <style>
    //             :root {
    //                 --primary-color: #4A90E2;
    //                 --secondary-color: #F5A623;
    //                 --accent-color: #7ED321;
    //                 --text-color: #333333;
    //                 --light-bg: #F8F9FA;
    //             }
    //             body {
    //                 font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    //                 line-height: 1.6;
    //                 color: var(--text-color);
    //                 margin: 0;
    //                 padding: 0;
    //                 background: var(--light-bg);
    //             }
    //             .container {
    //                 max-width: 1200px;
    //                 margin: 0 auto;
    //                 padding: 20px;
    //             }
    //             header {
    //                 background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    //                 color: white;
    //                 padding: 2rem 0;
    //                 text-align: center;
    //                 margin-bottom: 2rem;
    //                 border-radius: 0 0 20px 20px;
    //                 box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    //             }
    //             .logo {
    //                 font-size: 2.5rem;
    //                 font-weight: bold;
    //                 margin-bottom: 1rem;
    //                 text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    //             }
    //             .tagline {
    //                 font-size: 1.2rem;
    //                 opacity: 0.9;
    //             }
    //             .author-info {
    //                 background: white;
    //                 padding: 1rem;
    //                 border-radius: 10px;
    //                 margin: 2rem 0;
    //                 display: flex;
    //                 align-items: center;
    //                 gap: 1rem;
    //                 box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    //             }
    //             .author-avatar {
    //                 width: 80px;
    //                 height: 80px;
    //                 border-radius: 50%;
    //                 object-fit: cover;
    //             }
    //             .author-bio {
    //                 flex: 1;
    //             }
    //             .author-name {
    //                 font-weight: bold;
    //                 color: var(--primary-color);
    //                 margin: 0;
    //             }
    //             .author-title {
    //                 color: #666;
    //                 margin: 0.5rem 0;
    //             }
    //             .content-section {
    //                 background: white;
    //                 padding: 2rem;
    //                 margin: 2rem 0;
    //                 border-radius: 15px;
    //                 box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    //             }
    //             .section-title {
    //                 color: var(--primary-color);
    //                 border-bottom: 2px solid var(--secondary-color);
    //                 padding-bottom: 0.5rem;
    //                 margin-bottom: 1.5rem;
    //             }
    //             .feature-grid {
    //                 display: grid;
    //                 grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    //                 gap: 2rem;
    //                 margin: 2rem 0;
    //             }
    //             .feature-card {
    //                 background: white;
    //                 padding: 1.5rem;
    //                 border-radius: 10px;
    //                 box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    //                 transition: transform 0.3s ease;
    //             }
    //             .feature-card:hover {
    //                 transform: translateY(-5px);
    //             }
    //             .feature-icon {
    //                 font-size: 2rem;
    //                 color: var(--accent-color);
    //                 margin-bottom: 1rem;
    //             }
    //             .image-gallery {
    //                 display: grid;
    //                 grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    //                 gap: 1rem;
    //                 margin: 2rem 0;
    //             }
    //             .gallery-item {
    //                 position: relative;
    //                 overflow: hidden;
    //                 border-radius: 10px;
    //                 aspect-ratio: 16/9;
    //             }
    //             .gallery-item img {
    //                 width: 100%;
    //                 height: 100%;
    //                 object-fit: cover;
    //                 transition: transform 0.3s ease;
    //             }
    //             .gallery-item:hover img {
    //                 transform: scale(1.05);
    //             }
    //             .cta-button {
    //                 display: inline-block;
    //                 background: var(--primary-color);
    //                 color: white;
    //                 padding: 1rem 2rem;
    //                 border-radius: 25px;
    //                 text-decoration: none;
    //                 font-weight: bold;
    //                 transition: background 0.3s ease;
    //                 margin: 1rem 0;
    //             }
    //             .cta-button:hover {
    //                 background: var(--secondary-color);
    //             }
    //             footer {
    //                 background: #333;
    //                 color: white;
    //                 padding: 2rem 0;
    //                 margin-top: 3rem;
    //                 text-align: center;
    //             }
    //             .social-links {
    //                 margin: 1rem 0;
    //             }
    //             .social-links a {
    //                 color: white;
    //                 margin: 0 1rem;
    //                 text-decoration: none;
    //             }
    //             @media (max-width: 768px) {
    //                 .container {
    //                     padding: 10px;
    //                 }
    //                 .feature-grid {
    //                     grid-template-columns: 1fr;
    //                 }
    //                 .image-gallery {
    //                     grid-template-columns: 1fr;
    //                 }
    //             }
    //         </style>
    //     </head>
    //     <body>
    //         <header>
    //             <div class="container">
    //                 <div class="logo">Pawsome Playhouse</div>
    //                 <div class="tagline">Creating Perfect Spaces for Happy Paws</div>
    //             </div>
    //         </header>

    //         <div class="container">
    //             <div class="author-info">
    //                 <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e" alt="Dr. Sarah Johnson" class="author-avatar">
    //                 <div class="author-bio">
    //                     <h3 class="author-name">Dr. Sarah Johnson</h3>
    //                     <p class="author-title">Canine Behavior Specialist & Certified Dog Trainer</p>
    //                     <p>With over 15 years of experience in canine behavior and training, Dr. Johnson specializes in creating optimal living environments for dogs of all breeds and sizes.</p>
    //                 </div>
    //             </div>

    //             <div class="content-section">
    //                 <h2 class="section-title">The Ultimate Guide to Dog Playhouses</h2>
    //                 <p>Welcome to Pawsome Playhouse, your comprehensive resource for everything related to dog playhouses. Whether you're looking to build your own, purchase a pre-made structure, or simply learn more about creating the perfect play space for your furry friend, you've come to the right place.</p>
    //             </div>

    //             <div class="content-section">
    //                 <h2 class="section-title">Why Your Dog Needs a Playhouse</h2>
    //                 <div class="feature-grid">
    //                     <div class="feature-card">
    //                         <div class="feature-icon">🏠</div>
    //                         <h3>Personal Space</h3>
    //                         <p>Dogs, like humans, need their own space to relax and feel secure. A dedicated playhouse provides a safe haven where your dog can retreat when feeling overwhelmed or tired.</p>
    //                     </div>
    //                     <div class="feature-card">
    //                         <div class="feature-icon">🎯</div>
    //                         <h3>Mental Stimulation</h3>
    //                         <p>Playhouses offer various opportunities for mental engagement through different textures, levels, and interactive elements, helping prevent boredom and destructive behavior.</p>
    //                     </div>
    //                     <div class="feature-card">
    //                         <div class="feature-icon">🌡️</div>
    //                         <h3>Weather Protection</h3>
    //                         <p>Whether it's scorching heat or pouring rain, a well-designed playhouse provides shelter and comfort for your dog in any weather condition.</p>
    //                     </div>
    //                 </div>
    //             </div>

    //             <div class="content-section">
    //                 <h2 class="section-title">Latest Trends in Dog Playhouses</h2>
    //                 <p>The world of dog playhouses is evolving rapidly, with new designs and features emerging regularly. Here are some of the most exciting trends we're seeing in 2024:</p>
                    
    //                 <h3>1. Smart Playhouses</h3>
    //                 <p>Modern playhouses now come equipped with temperature control, automated feeding systems, and even built-in cameras for monitoring your pet's activities.</p>

    //                 <h3>2. Eco-Friendly Materials</h3>
    //                 <p>Sustainable materials like bamboo, recycled plastic, and reclaimed wood are becoming increasingly popular in playhouse construction.</p>

    //                 <h3>3. Modular Designs</h3>
    //                 <p>Customizable playhouses that can be expanded or modified as your dog grows or your needs change are gaining traction.</p>

    //                 <div class="image-gallery">
    //                     <div class="gallery-item">
    //                         <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b" alt="Modern Dog Playhouse">
    //                     </div>
    //                     <div class="gallery-item">
    //                         <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1" alt="Eco-Friendly Design">
    //                     </div>
    //                     <div class="gallery-item">
    //                         <img src="https://images.unsplash.com/photo-1534361960057-19889db9621e" alt="Smart Playhouse">
    //                     </div>
    //                 </div>
    //             </div>

    //             <div class="content-section">
    //                 <h2 class="section-title">Expert Tips for Choosing the Perfect Playhouse</h2>
    //                 <ol>
    //                     <li><strong>Consider Your Dog's Size:</strong> The playhouse should be large enough for your dog to stand, turn around, and lie down comfortably.</li>
    //                     <li><strong>Climate Considerations:</strong> Choose materials and design features that suit your local weather conditions.</li>
    //                     <li><strong>Location Matters:</strong> Place the playhouse in a spot that's easily accessible but protected from extreme weather.</li>
    //                     <li><strong>Safety First:</strong> Ensure all materials are non-toxic and the structure is stable and secure.</li>
    //                     <li><strong>Maintenance:</strong> Consider how easy it will be to clean and maintain the playhouse.</li>
    //                 </ol>
    //             </div>

    //             <div class="content-section">
    //                 <h2 class="section-title">DIY Playhouse Guide</h2>
    //                 <p>Building your own dog playhouse can be a rewarding project. Here's a basic guide to get you started:</p>
                    
    //                 <h3>Materials Needed:</h3>
    //                 <ul>
    //                     <li>Weather-resistant wood (cedar or pressure-treated pine)</li>
    //                     <li>Roofing materials (shingles or metal)</li>
    //                     <li>Insulation (for temperature control)</li>
    //                     <li>Basic tools (hammer, saw, drill)</li>
    //                     <li>Weatherproof paint or stain</li>
    //                 </ul>

    //                 <h3>Basic Steps:</h3>
    //                 <ol>
    //                     <li>Design your playhouse (consider your dog's size and needs)</li>
    //                     <li>Build the frame and floor</li>
    //                     <li>Add walls and roof</li>
    //                     <li>Install insulation and weatherproofing</li>
    //                     <li>Add finishing touches (paint, decorations)</li>
    //                 </ol>
    //             </div>

    //             <div class="content-section">
    //                 <h2 class="section-title">Ready to Get Started?</h2>
    //                 <p>Whether you're looking to build your own playhouse or purchase a pre-made one, we're here to help. Check out our comprehensive guides, product reviews, and expert advice to create the perfect space for your furry friend.</p>
    //                 <a href="#" class="cta-button">Explore Our Playhouse Collection</a>
    //             </div>
    //         </div>

    //         <footer>
    //             <div class="container">
    //                 <p>© 2024 Pawsome Playhouse. All rights reserved.</p>
    //                 <div class="social-links">
    //                     <a href="#">Facebook</a>
    //                     <a href="#">Instagram</a>
    //                     <a href="#">Twitter</a>
    //                     <a href="#">Pinterest</a>
    //                 </div>
    //                 <p>Contact: info@pawsomeplayhouse.com</p>
    //             </div>
    //         </footer>
    //     </body>
    //     </html>
    //     `;
    //     res.send(blogContent);
    // } else {
        console.log('Serving user content with redirect');
        // For real users, set a cookie to check JavaScript support
        res.cookie('jsEnabled', 'true', { maxAge: 900000 });
        
        // Serve the redirect page with JavaScript
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Redirecting...</title>
                <script>
                    // Your destination URL here
                    const destinationUrl = 'https://www.amazon.com/ODDS-Shifter-Featuring-Rechargeable-Indicator/dp/B0CWS7ZJTV?maas=maas_adg_C145EEC56A111949CD5C5C5FF0D05E46_afap_abs&ref_=aa_maas&tag=maas&th=1';
                    
                    // Add a small delay to make it look more natural
                    setTimeout(() => {
                        window.location.href = destinationUrl;
                    }, 1000);
                </script>
            </head>
            <body>
                <p>Please wait while we redirect you...</p>
                <script src="/tracking.js"></script>
            </body>
            </html>
        `);
    // }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 