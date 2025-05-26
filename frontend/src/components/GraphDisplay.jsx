import React, { useEffect, useRef, useState } from "react";
import Sigma from "sigma";
import Graph from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { motion, AnimatePresence } from "framer-motion";

const GraphDisplay = ({ visualizationData, setSelectedNode }) => {
  const containerRef = useRef(null);
  const sigmaRef = useRef(null);
  const [nodeProperties, setNodeProperties] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!visualizationData || !visualizationData.nodes || !visualizationData.edges || !containerRef.current) {
      console.warn("Visualization data is missing or incomplete:", visualizationData);
      return;
    }

    setIsLoading(true);

    // Kill previous instance
    if (sigmaRef.current) {
      sigmaRef.current.kill();
      sigmaRef.current = null;
    }

    const graph = new Graph({ multi: true });

    // Add nodes with enhanced styling
    visualizationData.nodes.forEach((node) => {
      graph.addNode(node.id, {
        label: node.label,
        x: node.x || Math.random(),
        y: node.y || Math.random(),
        size: node.size || 8,
        color: node.color || "#3498DB",
        properties: node.properties,
        labelColor: "#2C3E50",
        labelSize: 12,
        labelWeight: "bold",
        borderColor: "#2C3E50",
        borderSize: 2,
        hoverColor: "#E74C3C",
      });
    });

    // Add edges with enhanced styling
    visualizationData.edges.forEach((edge) => {
      if (!graph.hasEdge(edge.id)) {
        if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
          graph.addEdgeWithKey(edge.id, edge.source, edge.target, {
            label: edge.label || "",
            size: edge.size || 2,
            color: edge.color || "#95A5A6",
            labelColor: "#7F8C8D",
            labelSize: 10,
            hoverColor: "#E74C3C",
          });
        }
      }
    });

    // Apply force-directed layout with improved settings
    forceAtlas2.assign(graph, {
      iterations: 200,
      settings: {
        gravity: 0.5,
        scalingRatio: 2,
        slowDown: 1.5,
        barnesHutOptimize: true,
      },
    });

    // Initialize Sigma with custom settings
    const sigma = new Sigma(graph, containerRef.current, {
      minCameraRatio: 0.1,
      maxCameraRatio: 10,
      labelRenderedSizeThreshold: 6,
      labelSize: 12,
      labelWeight: "bold",
      labelColor: { color: "#2C3E50" },
      renderEdgeLabels: true,
      defaultNodeColor: "#3498DB",
      defaultEdgeColor: "#95A5A6",
    });

    sigmaRef.current = sigma;

    // Smooth camera animation
    sigma.getCamera().animatedReset({
      duration: 1000,
    });

    // Enhanced node click interaction
    sigma.on("clickNode", ({ node }) => {
      const props = graph.getNodeAttributes(node);
      setNodeProperties(props.properties);

      // Get node position and convert to screen coordinates
      const { x, y } = graph.getNodeAttributes(node);
      const screenCoords = sigma.graphToViewport({ x, y });
      setPopupPosition({ x: screenCoords.x, y: screenCoords.y });

      if (setSelectedNode) setSelectedNode(props);

      // Highlight connected nodes
      const connectedNodes = new Set();
      graph.forEachEdge(node, (edge, attributes, source, target) => {
        connectedNodes.add(source);
        connectedNodes.add(target);
      });

      graph.forEachNode((nodeId, attributes) => {
        if (connectedNodes.has(nodeId)) {
          graph.setNodeAttribute(nodeId, "highlighted", true);
        } else {
          graph.setNodeAttribute(nodeId, "highlighted", false);
        }
      });
    });

    // Reset highlights on background click
    sigma.on("clickStage", () => {
      graph.forEachNode((nodeId) => {
        graph.setNodeAttribute(nodeId, "highlighted", false);
      });
      setNodeProperties(null);
    });

    setIsLoading(false);

    return () => {
      if (sigmaRef.current) sigmaRef.current.kill();
    };
  }, [visualizationData, setSelectedNode]);

  return (
    <div className="graph-container">
      {isLoading && (
        <div className="loader-container">
          <div className="loader" />
        </div>
      )}
      
      <div
        ref={containerRef}
        className="graph-canvas"
        style={{
          height: "600px",
          width: "100%",
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />
      
      <AnimatePresence>
        {nodeProperties && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="node-details-popup"
            style={{
              position: "absolute",
              top: `${popupPosition.y}px`,
              left: `${popupPosition.x}px`,
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
            }}
          >
            <div className="node-details-content">
              <h3>Node Properties</h3>
              <ul>
                {Object.entries(nodeProperties).map(([key, value]) => (
                  <motion.li
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <strong>{key.replace(/_/g, ' ')}:</strong> {value || "N/A"}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GraphDisplay;
