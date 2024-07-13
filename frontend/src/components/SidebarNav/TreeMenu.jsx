import React, { useState, useEffect } from "react";
import { Tree } from "primereact/tree";
import { cloneDeep } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";

import { deleteNode, add } from "../../features/projectSlice";
import { setActiveNodeId } from "../../features/activeSlice";
import { findNodeFromKey, findNodeListByKey, isCopiedNodesSiblings } from "../../utils/nodes";
import "./treeMenu.css";

export default function TreeMenu() {
  const dispatch = useDispatch();
  const projectNodes = useSelector((store) => store.project);
  const [selectedKeys, setSelectedKeys] = useState(null);
  const [clipboard, setClipboard] = useState(null);
  const [trashBin, setTrashBin] = useState([]);

  let nodes = [projectNodes];
  useEffect(() => {
    nodes = [projectNodes];
  }, [projectNodes]);

  /**
   * Handle selection change in the tree, set the active node and update the selected keys
   * @param {Object} e - The selection change event
   */
  const handleSelectionChange = (e) => {
    console.log("e.value: ", e.value);
    const selectedKeys = Object.keys(e.value);
    const lastSelectedKey = selectedKeys[selectedKeys.length - 1];
    const activatedNode = findNodeFromKey(nodes, lastSelectedKey);
    console.log("activatedNode: ", activatedNode);
    console.log("nodes: ", nodes);

    dispatch(setActiveNodeId({ node: activatedNode, projectHierarchy: nodes }));
    setSelectedKeys(e.value);
  };

  /**
   * Verify that the selected nodes are valid for copy
   * If so; deep clone then and add the clones to clipboard
   */
  const copyNodes = () => {
    if (!selectedKeys) return;

    // Make deep copies to avoid passing nested objects by reference
    const copiedNodes = findNodeListByKey(nodes, selectedKeys).map((node) => cloneDeep(node));
    if (!isCopiedNodesSiblings(copiedNodes)) return;

    setClipboard(copiedNodes);
    console.log("Copied nodes: ", copiedNodes);
  };

  /**
   * Paste nodes from clipboard to the selected target nodes
   */
  const pasteNodes = () => {
    if (!clipboard || !selectedKeys) return;

    const depthOfCopiedNodes = clipboard[0].depth;

    // targetKeys = array of keys for the nodes onto which the copied nodes are to be pasted
    const targetKeys = Object.keys(selectedKeys).filter((key) => selectedKeys[key]);

    targetKeys.forEach((targetKey) => {
      const targetNode = findNodeListByKey(nodes, { [targetKey]: true })[0];
      console.log("targetNode: ", targetNode);
      if (!targetNode) return;

      // nodesToAdd = array of deep copies of the copied nodes
      const nodesToAdd = clipboard.map((node) => {
        const newNode = cloneDeep(node);
        newNode.key = nanoid();
        newNode.parent = targetNode.key;
        return newNode;
      });

      // Paste to the the target node
      if (targetNode.depth === depthOfCopiedNodes - 1) {
        dispatch(add({ targetKey: targetNode.key, nodesToAdd }));
      }

      // Paste to the parent of the target node
      if (targetNode.depth === depthOfCopiedNodes && targetNode.parent) {
        dispatch(add({ targetKey: targetNode.parent.key, nodesToAdd }));
      }
    });
  };

  /**
   * Move the selected nodes to the trashbin
   * TODO: Implement a 'recover' function
   */
  const deleteNodes = () => {
    if (!selectedKeys) return;

    const keys = Object.keys(selectedKeys).reduce((acc, key) => {
      if (selectedKeys[key]) acc[key] = true;
      return acc;
    }, {});

    const nodesToDelete = findNodeListByKey(nodes, keys);
    setTrashBin((prevTrashBin) => [...prevTrashBin, ...nodesToDelete]);

    dispatch(deleteNode(keys));
    setSelectedKeys(null);
    console.log("Deleted nodes: ", nodesToDelete);
  };

  /**
   * Listen for ctrl+c, ctrl+v, ctrl+x and del and call the appropriate handlers
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "c") {
        copyNodes();
      } else if (e.ctrlKey && e.key === "v") {
        pasteNodes();
      } else if (e.key === "Delete") {
        deleteNodes();
      } else if (e.ctrlKey && e.key === "x") {
        deleteNodes();
        copyNodes();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedKeys, clipboard]);

  /**
   * Handle drag and drop
   * event.dragNode contains the node being dragged
   */
  const handleDropDrag = (event) => {
    console.log(event);
    console.log("event.dragNode: ", event.dragNode);
    console.log("event.dropNode: ", event.dropNode);

    // If the dragged node is a child of the target node; move the node to the target
    if (event.dragNode.depth === event.dropNode.depth + 1) {
      console.log("Move node to target");
      const pastePayload = {
        targetKey: event.dropNode.key,
        nodesToAdd: [event.dragNode],
      };
      const deletePayload = { [event.dragNode.key]: true };

      dispatch(deleteNode(deletePayload));
      dispatch(add(pastePayload));

      // If the dragged node is a sibling of the target node; move the node to the parent of the target
    } else if (event.dragNode.depth === event.dropNode.depth) {
      // TODO: Check logic once the tree is more complex
      console.log("Same depth");
      const pastePayload = {
        targetKey: event.dropNode.parent,
        nodesToAdd: [event.dragNode],
      };
      const deletePayload = { [event.dragNode.key]: true };

      dispatch(deleteNode(deletePayload));
      dispatch(add(pastePayload));
    } else {
      console.log("Invalid move");
    }
  };

  return (
    <div className="card flex flex-column">
      <Tree
        value={nodes}
        metaKeySelection={true}
        selectionMode="multiple"
        selectionKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
        className="w-full md:w-16rem"
        dragdropScope="dd"
        onDragDrop={handleDropDrag}
      />
    </div>
  );
}
