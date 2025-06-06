import { Button } from "@/components/Button";
import {
  HeaderDocumentDataLeftSideLinksItem,
  Simplify,
} from "@/prismicio-types";

export default function HeaderLinkButton(
  props: Simplify<HeaderDocumentDataLeftSideLinksItem>
) {
  return <Button field={props.link} color="blue" />;
}
