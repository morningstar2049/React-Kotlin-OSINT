import { useEffect, useState } from "react";
import { dateFormatter, getScanHistory } from "../utils";
import { IScanHistory } from "../types";
import { InfoCard, Modal, SortableItem } from "../widgets";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function ScanHistoryPage() {
  const [scanRes, setScanRes] = useState<IScanHistory>([]);
  const [reqError, setReqError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(
    () => window.innerWidth
  );
  const [activeModalId, setActiveModalId] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const openedScan = scanRes.find((res) => res.id === activeModalId);

  useEffect(() => {
    getScanHistory()
      .then((res) => {
        const orderedRes: IScanHistory = JSON.parse(
          localStorage.getItem("orderedItems") || "[]"
        );
        if (!orderedRes.length) {
          setScanRes(res);
          return;
        }
        const sortedRes = res.sort((a, b) => {
          return (
            orderedRes.findIndex((el) => el.id === a.id) -
            orderedRes.findIndex((el) => el.id === b.id)
          );
        });
        setScanRes(sortedRes);
      })
      .catch((err) => {
        setReqError(err.toString());
      });
  }, []);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over!.id) {
      setScanRes((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newArrOrder = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem("orderedItems", JSON.stringify(newArrOrder));
        return newArrOrder;
      });
    }
  }

  return (
    <div className="flex items-center gap-10 flex-wrap">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={scanRes}
          strategy={
            windowWidth > 798
              ? horizontalListSortingStrategy
              : verticalListSortingStrategy
          }
        >
          {scanRes.map((scan) => (
            <SortableItem key={scan.id} id={scan.id}>
              <InfoCard
                title={scan.domain}
                buttonAction={() => {
                  console.log("aleko clicked", scan.id);
                  setActiveModalId(scan.id);
                  setIsModalOpen(true);
                }}
              >
                <p>
                  <strong>Start Time:</strong> {dateFormatter(scan.startTime)}
                </p>
                <p>
                  <strong>End Time:</strong> {dateFormatter(scan.endTime)}
                </p>
              </InfoCard>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      {reqError && <h2 className="text-red-700">{reqError}</h2>}
      <Modal
        open={isModalOpen}
        closeModal={() => {
          setReqError("");
          setIsModalOpen(false);
        }}
      >
        <Modal.ModalHeader>{openedScan?.domain}</Modal.ModalHeader>
        <Modal.ModalBody>
          <div className="space-y-5">
            <div>
              <p>
                <strong>Emails Found:</strong>{" "}
                {openedScan?.result?.emails?.length}
              </p>
              <div className="px-2">
                {openedScan?.result?.emails?.map((email, i) => (
                  <p key={i}>{email}</p>
                ))}
              </div>
            </div>
            <div>
              <p>
                <strong>Ip Adresses Found:</strong>{" "}
                {openedScan?.result?.ips?.length}
              </p>
              <div className="px-2">
                {openedScan?.result?.ips?.map((ip, i) => (
                  <p key={i}>{ip}</p>
                ))}
              </div>
            </div>
            <div>
              <p>
                <strong>LinkedIn Links Found:</strong>{" "}
                {openedScan?.result?.linkedInLinks?.length}
              </p>
              <div className="px-2">
                {openedScan?.result?.linkedInLinks?.map((linkedIn, i) => (
                  <p key={i}>{linkedIn}</p>
                ))}
              </div>
            </div>
          </div>
        </Modal.ModalBody>
      </Modal>
    </div>
  );
}

export default ScanHistoryPage;
