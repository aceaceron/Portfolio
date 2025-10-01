"use client";

import * as React from "react";
import ProjectDetailClient from "./ProjectDetailClient";

// Define the final, resolved shape
type ResolvedParams = { slug: string }; 

// Define Props, forcing 'params' to be a Promise of the resolved object.
// This is often required to satisfy the React.use() internal Usable type.
type Props = { 
    params: Promise<ResolvedParams>; // <--- Change is here: Removed the | ResolvedParams
}; 

export default function ProjectDetailPage({ params }: Props) {
  
  // React.use() now receives a type it expects (a Promise)
  const resolvedParams = React.use(params);
  
  const { slug } = resolvedParams;

  return <ProjectDetailClient slug={slug} />;
}