// D3.js Chart Functions for SICPA Audits Dashboard

function setupTooltip() {
    // Create global tooltip
    if (!document.querySelector('.tooltip')) {
        d3.select('body')
            .append('div')
            .attr('class', 'tooltip');
    }
}

function createVelocityChart() {
    const svg = d3.select('#velocityChart');
    const container = svg.node().parentNode;
    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width - 40;
    const height = 200;
    
    svg.attr('width', width).attr('height', height);
    
    // Clear previous content
    svg.selectAll('*').remove();
    
    const margin = {top: 20, right: 30, bottom: 30, left: 50};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Generate velocity data for last 8 sprints
    const data = Array.from({length: 8}, (_, i) => ({
        sprint: `Sprint ${i + 1}`,
        velocity: Math.floor(Math.random() * 20) + 30 + (i * 2) // Increasing trend
    }));
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.sprint))
        .range([0, innerWidth])
        .padding(0.1);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.velocity) + 10])
        .range([innerHeight, 0]);
    
    // Line generator
    const line = d3.line()
        .x(d => xScale(d.sprint) + xScale.bandwidth() / 2)
        .y(d => yScale(d.velocity))
        .curve(d3.curveMonotoneX);
    
    // Area generator
    const area = d3.area()
        .x(d => xScale(d.sprint) + xScale.bandwidth() / 2)
        .y0(innerHeight)
        .y1(d => yScale(d.velocity))
        .curve(d3.curveMonotoneX);
    
    // Add gradient
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
        .attr('id', 'velocityGradient')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0).attr('y1', innerHeight)
        .attr('x2', 0).attr('y2', 0);
    
    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#667eea')
        .attr('stop-opacity', 0.1);
    
    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#667eea')
        .attr('stop-opacity', 0.8);
    
    // Add grid lines
    g.selectAll('.grid-line')
        .data(yScale.ticks(5))
        .enter()
        .append('line')
        .attr('class', 'grid-line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d));
    
    // Add area
    g.append('path')
        .datum(data)
        .attr('class', 'chart-area')
        .attr('d', area)
        .style('fill', 'url(#velocityGradient)');
    
    // Add line
    g.append('path')
        .datum(data)
        .attr('class', 'line-chart-path')
        .attr('d', line)
        .style('stroke', '#667eea');
    
    // Add dots
    g.selectAll('.chart-dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'chart-dot')
        .attr('cx', d => xScale(d.sprint) + xScale.bandwidth() / 2)
        .attr('cy', d => yScale(d.velocity))
        .attr('r', 4)
        .style('fill', '#667eea')
        .on('mouseover', function(event, d) {
            const tooltip = d3.select('.tooltip');
            tooltip.style('opacity', 1)
                .html(`<strong>${d.sprint}</strong><br/>Velocity: ${d.velocity} points`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 30) + 'px');
        })
        .on('mouseout', function() {
            d3.select('.tooltip').style('opacity', 0);
        });
    
    // Add axes
    g.append('g')
        .attr('class', 'chart-axis')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale));
    
    g.append('g')
        .attr('class', 'chart-axis')
        .call(d3.axisLeft(yScale).ticks(5));
}

function createBurndownChart() {
    const svg = d3.select('#burndownChart');
    const container = svg.node().parentNode;
    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width - 40;
    const height = 200;
    
    svg.attr('width', width).attr('height', height);
    svg.selectAll('*').remove();
    
    const margin = {top: 20, right: 30, bottom: 30, left: 50};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Generate burndown data
    const totalStories = 50;
    const sprintDays = 10;
    const data = Array.from({length: sprintDays + 1}, (_, i) => {
        const idealRemaining = totalStories - (totalStories * i / sprintDays);
        const actualRemaining = Math.max(0, idealRemaining - Math.random() * 5 + 2);
        return {
            day: i,
            ideal: idealRemaining,
            actual: i === 0 ? totalStories : actualRemaining
        };
    });
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const xScale = d3.scaleLinear()
        .domain([0, sprintDays])
        .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
        .domain([0, totalStories])
        .range([innerHeight, 0]);
    
    // Line generators
    const idealLine = d3.line()
        .x(d => xScale(d.day))
        .y(d => yScale(d.ideal));
    
    const actualLine = d3.line()
        .x(d => xScale(d.day))
        .y(d => yScale(d.actual))
        .curve(d3.curveMonotoneX);
    
    // Add ideal line
    g.append('path')
        .datum(data)
        .attr('class', 'line-chart-path')
        .attr('d', idealLine)
        .style('stroke', '#bdc3c7')
        .style('stroke-dasharray', '5,5');
    
    // Add actual line
    g.append('path')
        .datum(data)
        .attr('class', 'line-chart-path')
        .attr('d', actualLine)
        .style('stroke', '#e74c3c');
    
    // Add dots for actual line
    g.selectAll('.actual-dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'chart-dot')
        .attr('cx', d => xScale(d.day))
        .attr('cy', d => yScale(d.actual))
        .attr('r', 3)
        .style('fill', '#e74c3c')
        .on('mouseover', function(event, d) {
            const tooltip = d3.select('.tooltip');
            tooltip.style('opacity', 1)
                .html(`<strong>Day ${d.day}</strong><br/>Remaining: ${Math.round(d.actual)} stories`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 30) + 'px');
        })
        .on('mouseout', function() {
            d3.select('.tooltip').style('opacity', 0);
        });
    
    // Add axes
    g.append('g')
        .attr('class', 'chart-axis')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(sprintDays));
    
    g.append('g')
        .attr('class', 'chart-axis')
        .call(d3.axisLeft(yScale));
    
    // Add legend
    const legend = g.append('g')
        .attr('transform', `translate(${innerWidth - 120}, 20)`);
    
    legend.append('line')
        .attr('x1', 0).attr('x2', 20)
        .attr('y1', 0).attr('y2', 0)
        .style('stroke', '#bdc3c7')
        .style('stroke-dasharray', '5,5');
    
    legend.append('text')
        .attr('x', 25).attr('y', 4)
        .style('font-size', '12px')
        .style('fill', '#7f8c8d')
        .text('Ideal');
    
    legend.append('line')
        .attr('x1', 0).attr('x2', 20)
        .attr('y1', 15).attr('y2', 15)
        .style('stroke', '#e74c3c');
    
    legend.append('text')
        .attr('x', 25).attr('y', 19)
        .style('font-size', '12px')
        .style('fill', '#7f8c8d')
        .text('Actual');
}

function createBugTrendsChart() {
    const svg = d3.select('#bugChart');
    const container = svg.node().parentNode;
    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width - 40;
    const height = 200;
    
    svg.attr('width', width).attr('height', height);
    svg.selectAll('*').remove();
    
    const margin = {top: 20, right: 30, bottom: 30, left: 50};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Generate bug data
    const data = [
        {type: 'Critical', count: 2, color: '#e74c3c'},
        {type: 'High', count: 8, color: '#f39c12'},
        {type: 'Medium', count: 15, color: '#f1c40f'},
        {type: 'Low', count: 25, color: '#27ae60'}
    ];
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.type))
        .range([0, innerWidth])
        .padding(0.2);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([innerHeight, 0]);
    
    // Add bars
    g.selectAll('.bar-rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar-rect')
        .attr('x', d => xScale(d.type))
        .attr('y', d => yScale(d.count))
        .attr('width', xScale.bandwidth())
        .attr('height', d => innerHeight - yScale(d.count))
        .style('fill', d => d.color)
        .on('mouseover', function(event, d) {
            const tooltip = d3.select('.tooltip');
            tooltip.style('opacity', 1)
                .html(`<strong>${d.type} Priority</strong><br/>${d.count} bugs`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 30) + 'px');
        })
        .on('mouseout', function() {
            d3.select('.tooltip').style('opacity', 0);
        });
    
    // Add value labels on bars
    g.selectAll('.bar-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'chart-label')
        .attr('x', d => xScale(d.type) + xScale.bandwidth() / 2)
        .attr('y', d => yScale(d.count) - 5)
        .attr('text-anchor', 'middle')
        .text(d => d.count);
    
    // Add axes
    g.append('g')
        .attr('class', 'chart-axis')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale));
    
    g.append('g')
        .attr('class', 'chart-axis')
        .call(d3.axisLeft(yScale));
}

function createTeamDistributionChart() {
    const svg = d3.select('#teamChart');
    const container = svg.node().parentNode;
    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width - 40;
    const height = 200;
    
    svg.attr('width', width).attr('height', height);
    svg.selectAll('*').remove();
    
    const radius = Math.min(width, height) / 2 - 20;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Team composition data
    const teamSize = window.currentAudit?.teamSize || 8;
    const data = [
        {role: 'Developers', count: Math.floor(teamSize * 0.5), color: '#3498db'},
        {role: 'QA', count: Math.floor(teamSize * 0.25), color: '#e74c3c'},
        {role: 'DevOps', count: Math.ceil(teamSize * 0.125), color: '#f39c12'},
        {role: 'PM', count: Math.ceil(teamSize * 0.125), color: '#9b59b6'}
    ];
    
    const pie = d3.pie()
        .value(d => d.count)
        .sort(null);
    
    const arc = d3.arc()
        .innerRadius(radius * 0.4)
        .outerRadius(radius);
    
    const outerArc = d3.arc()
        .innerRadius(radius * 1.1)
        .outerRadius(radius * 1.1);
    
    const g = svg.append('g')
        .attr('transform', `translate(${centerX},${centerY})`);
    
    const arcs = g.selectAll('.pie-slice')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'pie-slice');
    
    // Add pie slices
    arcs.append('path')
        .attr('d', arc)
        .style('fill', d => d.data.color)
        .style('stroke', 'white')
        .style('stroke-width', 2)
        .on('mouseover', function(event, d) {
            const tooltip = d3.select('.tooltip');
            tooltip.style('opacity', 1)
                .html(`<strong>${d.data.role}</strong><br/>${d.data.count} members`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 30) + 'px');
        })
        .on('mouseout', function() {
            d3.select('.tooltip').style('opacity', 0);
        });
    
    // Add labels
    arcs.append('text')
        .attr('transform', d => {
            const pos = outerArc.centroid(d);
            pos[0] = radius * 0.95 * (d.endAngle + d.startAngle) / 2 < Math.PI ? 1 : -1;
            return `translate(${pos})`;
        })
        .style('text-anchor', d => (d.endAngle + d.startAngle) / 2 < Math.PI ? 'start' : 'end')
        .style('font-size', '12px')
        .style('fill', '#2c3e50')
        .text(d => `${d.data.role} (${d.data.count})`);
    
    // Add connecting lines
    arcs.append('polyline')
        .attr('points', d => {
            const pos = outerArc.centroid(d);
            pos[0] = radius * 0.95 * (d.endAngle + d.startAngle) / 2 < Math.PI ? 1 : -1;
            return [arc.centroid(d), outerArc.centroid(d), pos];
        })
        .style('fill', 'none')
        .style('stroke', '#bdc3c7')
        .style('stroke-width', 1);
}
