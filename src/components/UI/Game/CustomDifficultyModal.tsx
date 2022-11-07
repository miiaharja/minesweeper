/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CustomDifficultyFields) => void;
};

export type CustomDifficultyFields = {
  height: string;
  width: string;
  mines: string;
};

export function CustomDifficultyModal({ isOpen, onClose, onSubmit }: Props) {
  const { t } = useTranslation();

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<CustomDifficultyFields>();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel htmlFor="height">{t("game.height")}</FormLabel>
              <Input
                id="height"
                type="number"
                placeholder={t("game.width")}
                {...register("height", {
                  required: "This is required",
                })}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel htmlFor="width">{t("game.width")}</FormLabel>
              <Input
                id="width"
                type="number"
                placeholder={t("game.width")}
                {...register("width", {
                  required: "This is required",
                })}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel htmlFor="mines">{t("game.mines")}</FormLabel>
              <Input
                id="mines"
                type="number"
                placeholder={t("game.mines")}
                {...register("mines", {
                  required: "This is required",
                })}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button type="submit" isLoading={isSubmitting} colorScheme="green">
              {t("general.save")}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
