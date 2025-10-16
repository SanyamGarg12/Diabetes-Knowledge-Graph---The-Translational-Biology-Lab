import React, { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import { useApp } from "../store";
import { getColorForLabel } from "../utils/colorMapping";
import GraphLegend from "./GraphLegend";

export default function GraphView() {
	const cyRef = useRef(null);
	const fullscreenCyRef = useRef(null);
	const containerRef = useRef(null);
	const fullscreenContainerRef = useRef(null);
	const { nodes, edges, seed } = useApp();
	const [isFullscreen, setIsFullscreen] = useState(false);

	// Create Cytoscape configuration
	const createCytoscapeConfig = (container) => ({
		container,
		style: [
			{ 
				selector: "node", 
				style: { 
					label: "data(label)", 
					"font-size": 10, 
					"background-color": "data(color)",
					"border-width": 2,
					"border-color": "#333",
					"text-outline-width": 1,
					"text-outline-color": "#fff"
				} 
			},
			{ 
				selector: "edge", 
				style: { 
					"curve-style": "bezier", 
					width: 1, 
					"line-color": "#bbb", 
					"font-size": 8, 
					label: "data(label)",
					"target-arrow-shape": "triangle",
					"target-arrow-color": "#bbb"
				} 
			},
			{ 
				selector: ".seed", 
				style: { 
					"background-color": "#e67",
					"border-width": 4,
					"border-color": "#c33",
					"width": 30,
					"height": 30
				} 
			}
		],
		wheelSensitivity: 0.2,
	});

	// Function to render graph data
	const renderGraphData = (cyInstance) => {
		if (!cyInstance) return;
		
		try {
			cyInstance.elements().remove();

			const N = [...nodes.values()];
			const E = edges;
			console.log(`Rendering graph data: ${N.length} nodes, ${E.length} edges`);
			
			const maxRender = 1200;
			const nlim = Math.min(N.length, Math.floor(maxRender * 0.6));
			const elim = Math.min(E.length, Math.floor(maxRender * 0.4));

			const cyNodes = N.slice(0, nlim).map((n) => {
				const nodeLabel = n.name || (n.props && n.props.name) || (Array.isArray(n.labels) && n.labels[0]) || "Node";
				const labelType = Array.isArray(n.labels) && n.labels[0] ? n.labels[0] : (n.label || "default");
				const nodeColor = getColorForLabel(labelType);
				
				return {
					data: {
						id: String(n.id),
						label: nodeLabel,
						color: nodeColor,
					},
					classes: seed && n.id === seed.id ? "seed" : "",
				};
			});

			const cyEdges = E.slice(0, elim).map((e, idx) => ({
				data: { id: `${e.src}-${e.dst}-${e.type}-${idx}`, source: String(e.src), target: String(e.dst), label: e.type },
			}));

			console.log(`Adding ${cyNodes.length} nodes and ${cyEdges.length} edges to graph`);
			cyInstance.add([...cyNodes, ...cyEdges]);
			
			// Only run layout if we have elements to layout
			if (cyNodes.length > 0 || cyEdges.length > 0) {
				const layout = cyInstance.layout({ name: "cose", animate: false });
				if (layout && typeof layout.run === 'function') {
					layout.run();
					console.log("Layout completed successfully");
				}
			}
		} catch (error) {
			console.error("Error rendering graph data:", error);
		}
	};

	// Initialize normal graph
	useEffect(() => {
		if (!containerRef.current) return;
		
		// Small delay to ensure DOM is ready
		const timer = setTimeout(() => {
			try {
				// Check if container has dimensions
				const container = containerRef.current;
				console.log(`Container dimensions: ${container.offsetWidth}x${container.offsetHeight}`);
				
				if (container.offsetWidth === 0 || container.offsetHeight === 0) {
					console.warn("Graph container has no dimensions, retrying...");
					// Retry after a longer delay
					setTimeout(() => {
						console.log(`Retry - Container dimensions: ${container.offsetWidth}x${container.offsetHeight}`);
						if (container.offsetWidth > 0 && container.offsetHeight > 0) {
							if (!cyRef.current) {
								console.log("Creating new Cytoscape instance (retry)");
								cyRef.current = cytoscape(createCytoscapeConfig(container));
							}
							renderGraphData(cyRef.current);
						}
					}, 100);
					return;
				}

				if (!cyRef.current) {
					console.log("Creating new Cytoscape instance");
					cyRef.current = cytoscape(createCytoscapeConfig(container));
				}
				renderGraphData(cyRef.current);
				
				// Ensure the graph is resized and fitted
				setTimeout(() => {
					if (cyRef.current) {
						cyRef.current.resize();
						cyRef.current.fit();
					}
				}, 50);
			} catch (error) {
				console.error("Error initializing normal graph:", error);
			}
		}, 10);

		return () => clearTimeout(timer);
	}, [nodes, edges, seed]);

	// Initialize fullscreen graph when fullscreen container is available
	useEffect(() => {
		if (!fullscreenContainerRef.current) return;
		
		// Small delay to ensure DOM is ready
		const timer = setTimeout(() => {
			try {
				if (!fullscreenCyRef.current) {
					fullscreenCyRef.current = cytoscape(createCytoscapeConfig(fullscreenContainerRef.current));
				}
				if (isFullscreen) {
					renderGraphData(fullscreenCyRef.current);
				}
			} catch (error) {
				console.error("Error initializing fullscreen graph:", error);
			}
		}, 10);

		return () => clearTimeout(timer);
	}, [isFullscreen, nodes, edges, seed]);

	// Handle fullscreen toggle
	const toggleFullscreen = () => {
		setIsFullscreen(!isFullscreen);
	};

	// Handle ESC key to exit fullscreen
	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === 'Escape' && isFullscreen) {
				setIsFullscreen(false);
			}
		};

		if (isFullscreen) {
			document.addEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'hidden'; // Prevent background scrolling
		} else {
			document.body.style.overflow = 'auto';
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'auto';
		};
	}, [isFullscreen]);

	// Cleanup Cytoscape instances
	useEffect(() => {
		return () => {
			if (cyRef.current) {
				cyRef.current.destroy();
			}
			if (fullscreenCyRef.current) {
				fullscreenCyRef.current.destroy();
			}
		};
	}, []);

	// Handle fullscreen graph resizing
	useEffect(() => {
		if (isFullscreen && fullscreenCyRef.current) {
			// Resize the fullscreen graph to fit the container
			setTimeout(() => {
				fullscreenCyRef.current.resize();
				fullscreenCyRef.current.fit();
			}, 100);
		}
	}, [isFullscreen]);

	// Handle window resize for normal graph
	useEffect(() => {
		const handleResize = () => {
			if (cyRef.current && !isFullscreen) {
				setTimeout(() => {
					cyRef.current.resize();
					cyRef.current.fit();
				}, 50);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [isFullscreen]);

	return (
		<>
			<div className="graph">
				<div 
					ref={containerRef} 
					style={{ 
						width: "100%", 
						height: "100%", 
						minHeight: "360px",
						position: "relative",
						background: "transparent"
					}} 
				/>
				<GraphLegend />
				<button 
					className="fullscreen-btn"
					onClick={toggleFullscreen}
					title="View graph in fullscreen (ESC to exit)"
				>
					⛶
				</button>
			</div>

			{isFullscreen && (
				<div className="fullscreen-overlay" onClick={toggleFullscreen}>
					<div 
						className="fullscreen-container"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="fullscreen-header">
							<h3>Knowledge Graph - Fullscreen View</h3>
							<button 
								className="close-fullscreen-btn"
								onClick={toggleFullscreen}
								title="Close fullscreen (ESC)"
							>
								✕
							</button>
						</div>
						<div className="fullscreen-graph">
							<div ref={fullscreenContainerRef} style={{ width: "100%", height: "100%" }} />
							<GraphLegend />
						</div>
					</div>
				</div>
			)}
		</>
	);
}


