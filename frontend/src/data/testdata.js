const testData = [
  {
    key: "0",
    depth: 0,
    label: "Prosjekt 1",
    data: {},
    icon: "pi pi-fw pi-building",
    children: [
      {
        key: "0-0",
        depth: 1,
        label: "Sone 1",
        data: {},
        icon: "pi pi-fw pi-box",
        children: [
          {
            key: "0-0-0",
            depth: 2,
            label: "Fasade1",
            icon: "pi pi-fw pi-home",
            data: {},
            children: [
              {
                key: "0-776",
                depth: 3,
                label: "Vindu 2",
                icon: "pi pi-fw pi-microsoft",
                data: {},
              },
              {
                key: "0-112",
                depth: 3,
                label: "Vindu 3",
                icon: "pi pi-fw pi-microsoft",
                data: "Resume Document",
              },
            ],
          },
          {
            key: "0-0-1",
            depth: 2,
            label: "Roof",
            icon: "pi pi-fw pi-map",
            data: "Resume Document",
          },
          {
            key: "0-765",
            depth: 2,
            label: "Gulv",
            icon: "pi pi-fw pi-stop",
            data: "Resume Document",
          },
        ],
      },
      {
        key: "0-1",
        depth: 1,
        label: "Sone 2",
        data: "Home Folder",
        icon: "pi pi-fw pi-box",
        children: [
          {
            key: "0-1-0",
            depth: 2,
            label: "Tak",
            data: "Events Folder",
            icon: "pi pi-fw pi-map",
          },
          {
            key: "154",
            depth: 2,
            label: "Fasade NØ",
            icon: "pi pi-fw pi-home",
            data: "Invoices for this month",
            children: [
              {
                key: "1-0",
                depth: 3,
                label: "Vindu NØ",
                icon: "pi pi-fw pi-microsoft",
                data: "Meeting",
              },
              {
                key: "1-1",
                depth: 3,
                label: "Vindu NV",
                icon: "pi pi-fw pi-microsoft",
                data: "Product Launch",
              },
              {
                key: "1-2",
                depth: 3,
                label: "Vindu liten",
                icon: "pi pi-fw pi-microsoft",
                data: "Report Review",
              },
            ],
          },
        ],
      },
    ],
  },
];

export default testData;
