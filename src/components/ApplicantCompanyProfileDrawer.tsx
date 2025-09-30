"use client";

import React from "react";
import { Drawer, DrawerContent, DrawerClose, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { CompanyProfileView } from "./company/CompanyProfileView";
import { X } from "lucide-react";

export type CompanyProfile = Required<Parameters<typeof CompanyProfileView>[0]>["company"];

interface ApplicantCompanyProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: CompanyProfile | null;
}

export function ApplicantCompanyProfileDrawer({ open, onOpenChange, company }: ApplicantCompanyProfileDrawerProps) {
  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="data-[vaul-drawer-direction=right]:w-[95vw] data-[vaul-drawer-direction=right]:sm:max-w-3xl data-[vaul-drawer-direction=right]:md:max-w-4xl data-[vaul-drawer-direction=right]:lg:max-w-5xl overflow-y-auto max-h-screen border-l bg-white overflow-x-hidden"
      >
        {/* Accessible title required by Radix/vaul */}
        <DrawerHeader className="sr-only">
          <DrawerTitle>Company Profile</DrawerTitle>
        </DrawerHeader>
        <div className="relative p-4">
          <button
            aria-label="Close"
            className="absolute right-4 top-4 rounded-md p-2 hover:bg-muted"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-4 pb-6">
          {company && <CompanyProfileView company={company} />}
        </div>
        <DrawerClose className="hidden" />
      </DrawerContent>
    </Drawer>
  );
}
